# Code Guide — Phase 2: User Module 👤

> Ngày viết: 2026-03-01
>
> Ở Phase 1, ta đã có hệ thống Auth làm "bảo vệ tòa nhà", cấp phát thẻ (JWT) cho cư dân. Sang Phase 2, ta xây dựng "căn hộ cá nhân" — nơi cư dân (User) tự do trang trí phòng ốc: đổi tên, viết tiểu sử, thay ổ khóa (đổi pass), và treo ảnh chân dung (upload avatar).

---

## Tổng quan — Phase 2 có gì vui?

Mục tiêu của ta là 4 API xoay quanh thông tin cá nhân. Bắt đầu từ Phase này, **mọi API đều yêu cầu "trình thẻ" (JWT)** trước khi vào:

1. `GET /users/me` — Xem hồ sơ bản thân (nhưng giấu tịt mã hash password).
2. `PATCH /users/me` — Sửa tên hiển thị (`displayName`) và tiểu sử (`bio`).
3. `PATCH /users/me/change-password` — Đổi mật khẩu an toàn (phải nhớ pass cũ, và pass mới không được trùng pass cũ).
4. `POST /users/me/avatar` — Thay ảnh đại diện (nhận file ảnh thật, nhét vào ổ đĩa, kiểm tra đúng chuẩn không quá 5MB).

### Kỹ thuật đinh của Phase 2
- **Prisma `select`**: Bộ lọc "chỉ lấy những gì cần thiết", tuyệt đối không vô tình lôi password hash ra ánh sáng.
- **Multer (FileInterceptor)**: "Bưu điện" nhận bưu kiện (file ảnh), kiểm tra kích thước, loại hàng, rồi ném vào đúng kho (`uploads/avatars/`).
- **Static Assets (`main.ts`)**: Mở cổng cho Frontend vào trực tiếp kho chứa ảnh để lấy ảnh hiển thị lên UI.

---

## Khởi động: Cập nhật Prisma Schema 🗄️

Trước khi xây nhà, phải có bản vẽ. User cần thêm 3 dòng vào schema: `displayName`, `bio` và `avatar`.

📁 **File:** `prisma/schema.prisma`

```prisma
model User {
  // ...các field cũ từ Phase 1...
  name          String        // Tên lúc đăng ký ban đầu (bắt buộc)
  displayName   String?       // Tên hiển thị thích khoe sau này (optional)
  bio           String?       // Tiểu sử ngắn gọn (optional)
  avatar        String?       // Tên file ảnh đã lưu (ví dụ: avatar-123.jpg)
  // ...
}
```

Chạy migration để DB cập nhật:
```bash
npx prisma migrate dev --name add-displayName-bio-to-user
```

> **Hỏi:** Tại sao `name` bắt buộc mà `displayName` lại optional? Vì lúc đăng ký ai cũng phải có tên. Còn `displayName` (nickname) là tiện ích phụ, user thích thì cập nhật, không thì FE cứ lấy `name` ra xài tạm.

---

## Bước 1: Setup Bưu Điện Multer (Upload Config) 📦

### Tại sao?
Khi user đẩy file ảnh lên, ta chặn ngay từ cửa: "Có phải ảnh không? Chuyển vào kho `/uploads/avatars/`. Quá 5MB là trả về!". Nhưng nếu cái kho đó chưa được xây (code vừa clone về chưa có thư mục `uploads`) thì hệ thống sập cái rầm. Ta phải viết code tự động "xây kho" nếu kho chưa có.

📁 **File:** `src/common/config/multer.config.ts`

```typescript
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// 1. CHUẨN BỊ KHO CHỨA
// Lấy đường dẫn gốc của project + uploads/avatars
const avatarDir = join(process.cwd(), 'uploads', 'avatars');

// Nếu kho chưa xây? Xây ngay lập tức (recursive: true để xây luôn thư mục cha nếu cần)
if (!existsSync(avatarDir)) {
  mkdirSync(avatarDir, { recursive: true });
}

// 2. CẤU HÌNH BƯU ĐIỆN VÀ NHÓM KIỂM KÊ
export const avatarMulterConfig = {
  // Kho bãi (storage): Lệnh cho Multer ghi trực tiếp file xuống ổ cứng (diskStorage)
  storage: diskStorage({
    destination: avatarDir,
    filename: (_req, file, callback) => {
      // Đổi tên file để tránh 2 ông cùng up 'avatar.jpg' chép đè nhau
      // Đóng dấu thời gian + mã số ngẫu nhiên
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),

  // Kích thước tối đa: 5MB
  limits: { fileSize: 5 * 1024 * 1024 },

  // Bộ lọc hải quan: Chỉ nhận ảnh!
  fileFilter: (_req, file, callback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return callback(new Error('Chỉ chấp nhận file ảnh (jpg, png, gif)!'), false);
    }
    callback(null, true);
  },
};
```

---

## Bước 2: DTOs — Cổng kiểm tra hành lý 🛂

Chặn đứng các thể loại phá hoại từ ngoài vào. Chỉ cho những gì ta cho phép đi lọt.

📁 **File:** `src/user/dto/update-profile.dto.ts`
```typescript
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  // @IsOptional: Sửa tên thì sửa, không sửa thì cập nhật mỗi cái bio cũng ok
  @IsOptional() @IsString() @MaxLength(50)
  displayName?: string;

  @IsOptional() @IsString() @MaxLength(160) // Cỡ Bio Twitter
  bio?: string;
}
```

📁 **File:** `src/user/dto/change-password.dto.ts`
```typescript
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString() @IsNotEmpty()
  currentPassword!: string; // Pass cũ, bắt buộc có để biết chính chủ

  @IsString() @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { message: 'Pass mới quá yếu!' })
  newPassword!: string;

  @IsString() @IsNotEmpty()
  confirmPassword!: string; 
  // Việc so sánh newPassword === confirmPassword ta sẽ nhường cho Service làm.
  // DTO chỉ kiểm tra từng món đơn lẻ thôi.
}
```

---

## Bước 3: UserService — Thợ máy tòa nhà 🛠️

Đây là chỗ tay chân lấm lem dầu mỡ. Thọc sâu vào DB, móc password cũ ra so sáng, xóa avatar cũ rích đi, băm password mới dán lại vào.

📁 **File:** `src/user/user.service.ts`

```typescript
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
import { join } from 'path';
import { UpdateProfileDto, ChangePasswordDto } from './dto'; // gom chung gọn gàng

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 1️⃣ BỘ LỌC PROFILE: Xài chung cho mọi method trả về User. 
  // Tôn chỉ tối cao: NGHIÊM CẤM load cột 'password' ra ánh sáng.
  private readonly profileSelect = {
    id: true, email: true, name: true, displayName: true,
    avatar: true, status: true, bio: true, 
    lastLoginAt: true, createdAt: true, updatedAt: true,
  } as const;

  // 2️⃣ XEM HỒ SƠ
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.profileSelect, // Áp dụng bộ lọc
    });
    if (!user) throw new NotFoundException('Không tìm thấy cư dân này');
    return user;
  }

  // 3️⃣ CẬP NHẬT TÊN / TIỂU SỬ
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Không gửi gì thì thôi gọi DB làm gì cho mệt?
    if (!dto.displayName && !dto.bio) {
      throw new BadRequestException('Bét ra cũng phải cập nhật 1 món chứ?');
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        // Cú pháp rải thảm: Có displayName thì thêm { displayName: ... } vào update list, không thì {} rỗng
        ...(dto.displayName ? { displayName: dto.displayName } : {}),
        ...(dto.bio ? { bio: dto.bio } : {}),
      },
      select: this.profileSelect, // Update xong móc DB ra trả FE luôn khỏi mất công FE GET lại
    });
  }

  // 4️⃣ ĐỔI CHÌA KHÓA (PASSWORD)
  async changePassword(userId: string, dto: ChangePasswordDto) {
    // 1. Kiểm tra cặp pass mới
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Pass mới và pass xác nhận gõ không tệp khớp!');
    }

    // 2. Kéo pass cũ (hash) lên để test
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, select: { password: true }, // Chỉ chĩa súng vào cột password
    });
    if (!user) throw new NotFoundException('Lỗi hệ thống');

    // 3. Đọ pass cũ nhập từ API vs pass cũ trong ổ cứng gác cổng
    const matches = await bcrypt.compare(dto.currentPassword, user.password);
    if (!matches) throw new BadRequestException('Pass cũ sai bét!');

    // 4. Pass mới không được luộc lại pass cũ
    const isSame = await bcrypt.compare(dto.newPassword, user.password);
    if (isSame) throw new BadRequestException('Vui lòng nghĩ pass khác đi');

    // 5. Băm nát pass mới
    const hashed = await bcrypt.hash(dto.newPassword, 10);

    // 6. ⚔️ TRANSACTION: Vừa dán pass mới, vừa tịch thu toàn bộ thẻ xe cũ (refresh token)
    // All or nothing - Lỡ thu thẻ lỗi thì pass cũng không bị thay!
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: userId }, data: { password: hashed } }),
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() }, // Giải tán hết rác token
      }),
    ]);

    return { message: 'Thay khóa thành công. Mời đăng nhập lại.' };
  }

  // 5️⃣ THAY ẢNH CHÂN DUNG
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    // Tới bước này, file thực chất ĐÃ vứt vào disk /uploads/avatars/ rồi (do Multer làm trước)
    // file.filename chính là tên file đang nằm ngoan trong thư mục.

    const user = await this.prisma.user.findUnique({
      where: { id: userId }, select: { avatar: true },
    });
    if (!user) throw new NotFoundException('Tài khoản bốc hơi');

    // Dọn toilet: Ảnh mốc cũ xì? Dọn ra bãi rác để nhẹ ổ cứng!
    if (user.avatar) {
      const oldPath = join(process.cwd(), 'uploads', 'avatars', user.avatar);
      await fs.unlink(oldPath).catch(() => {}); // Cứ nhắm mắt xóa, không có thì bỏ qua khỏi la làng
    }

    // Cầm bút dạ ghi tên file ảnh mới vào sổ hộ khẩu Prisma
    return await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: file.filename }, // Ta LƯU MỖI CÁI TÊN (vd: avatar-123.jpg), KHÔNG lưu full path URL nha!
      select: this.profileSelect,
    });
  }
}
```

---

## Bước 4: UserController — Lễ tân nhận khách 💁‍♀️

Code Controller càng mỏng càng tốt. Nhiệm vụ chỉ là hứng Request (HTTP body/file), lấy mặt User (cái `@CurrentUser` thần thánh Phase 1), rồi quăng tuột xuống Service. 

📁 **File:** `src/user/user.controller.ts`

```typescript
import { Controller, Get, Patch, Post, Body, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserService } from './user.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarMulterConfig } from 'src/common/config/multer.config';

@Controller('users')
@UseGuards(JwtAuthGuard) // 🛡 Cắm luôn cái khiên bảo vệ JWT chình ình trước chốt cửa
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getProfile(@CurrentUser('id') userId: string) { return this.userService.getProfile(userId); }

  @Patch('me') // PATCH chứ không PUT. Sửa ti tiện vài thứ chứ ai rảnh thay sạch.
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(userId, dto);
  }

  @Patch('me/change-password')
  changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(userId, dto);
  }

  @Post('me/avatar')
  // Block Multer trước mâm!
  @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
  uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile(
      // Chốt ParseFilePipe lại 1 vòng nữa. Cái này nó chặn lại file lỗi sau khi Multer hắt xì
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/i }),
        ],
      })
    ) file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(userId, file);
  }
}
```

---

## Bước 5: Đăng ký Hộ khẩu — UserModule & Sinh lộ Static Asset 🔌

Các mảng nhỏ xong thì phải kết vào ruột. 

📁 **File:** `src/user/user.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { avatarMulterConfig } from 'src/common/config/multer.config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  // Nạp cấu hình Multer để cả xóm xài
  imports: [MulterModule.register(avatarMulterConfig)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Bật cổng cho module khác nhờ vả hàm của mình
})
export class UserModule {}
```

> **Đừng quên:** import `UserModule` vào `AppModule` nhé!

### Mở cửa nhà kho ảnh ra cho giang hồ xem (Chỉ đọc) 
User tải ảnh lên `uploads/avatars/`. Nhưng API Server đâu có cấp thư mục `/uploads/` này làm đường web? Phải khoan tường kéo ống `useStaticAssets`.

📁 **File:** `src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // Ép kiểu để báo Express
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Nhét loại dõng dạc <NestExpressApplication> vô Nest mới ló mấy lệnh của Express ra
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ...các setup cũ như ValidationPipe, Prefix...

  // Bày thư mục uploads trực tiếp lên bàn mổ Web Server:
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/', // Trỏ url localhost:3333/uploads/avatars/hinhanhcuatoi.jpg
  });

  await app.listen(3333);
}
bootstrap();
```

---

## Cầm Hoppscotch / Postman lên múa 🧪

1. **Login vặt** (lấy token JWT bế lên ô Auth).
2. Tạt ngang `GET /api/v1/users/me` nhặt mặt mũi bản thân về coi.
3. Kẹp body JSON dán mớ `{"displayName": "Tuấn Xinh Trai"}` hẩy vô `PATCH /api/v1/users/me`. Gọi lại GET coi tên cập nhật chưa.
4. Lùa dao `PATCH /api/v1/users/me/change-password` quất sai pass coi nó lẩy lên chửi hông. Đúng là nó cho qua, xong mang cái token cũ chạy GET /users/me báo lỗi tiếp vì refresh bị tiễn rồi!
5. Gõ `POST /api/v1/users/me/avatar`. Ráng chọn **form-data** kẹp cái ảnh chừng đôi 3MB quất lên (key name là `avatar`). Nhớ lôi URL `/uploads/avatars/...` dán thẳng thanh URL Chrome coi ảnh phẹt ra màn hình hông.

---

## Checklist Phase 2 ✅
- [ ] Add `displayName`, `bio`, `avatar` vô Schema và cày migration.
- [ ] Tạo thợ chặn cửa file tại `multer.config.ts`.
- [ ] DTO rào Pass mới gõ regex tè le.
- [ ] UserService viết trọn gói (Giấu biệt password ở `profileSelect`). Xóa file cũ chà nồi sạch sẽ!
- [ ] Controller dán `FileInterceptor`. Guard khóa trọn.
- [ ] Bật ống xả `useStaticAssets` ở main.
- [ ] Chọt Swagger + Hoppscotch tè le rát máy.

---

## Q&A Bóc Gạch 🥸

**Q: Ủa cái `profileSelect` có gì bí thuật à? Quất `const { password, ...rest } = user` không nhàn hơn?**
> Được! Code vậy chạy láng, nhưng dở! Vì DB phải è ạch cuốc pass lên memory Nodejs rồi mầy mới vứt đi. `select` thì chặn luôn từ lệnh `SELECT` dưới hầm xe MySQL/PostgreSQL, nhẹ nhõm băng chuyền truyền tải. Cực khôn!

**Q: Cứ xóa avatar file trước khi update DB? Rủi chập DB cúp điện thì mất ảnh user rủi sao?!**  
> Đúng bài thiệt á! Chuẩn thì Update thành công rồi mới quét xóa. Nhưng ở code tutorial này chơi lật cho lẹ sòng. Update DB fail là tỉ lệ trúng vé xs. Các công ty lớn quăng qua AWS S3 là nó vứt sọt rác sau 7 ngày nhàn hơn nhiều!

**Q: FileInterceptor vs ParseFilePipe. Hai cha con thằng này cùng validate là sao?**  
> `FileInterceptor` (khoanh vùng trong `multer.config.ts`) thì đứng canh **trên đường ống nước tràn vào**! Rác rưởi là phọt luôn không nhận nạp RAM -> Hiệu năng cực đỉnh!
> `ParseFilePipe` thì đợi nó chảy xong kiểm tra lại lần cuối định dạng trước khi quăng lên controller. Khớp 2 lá chắn cho đỡ ghi đĩa lậu!
