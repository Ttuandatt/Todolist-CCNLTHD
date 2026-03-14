# 🚀 Hướng dẫn Code — Phase 2: User Module

## Tổng quan Phase 2

### Chúng ta đang làm gì?
Sau khi Auth hoạt động ổn định (Phase 1), Phase 2 tập trung vào **User Module** để user có thể xem/cập nhật hồ sơ cá nhân, đổi mật khẩu và upload avatar. Đây là module đầu tiên sử dụng dữ liệu thực tế từ bảng `users`, nên phải xử lý đồng bộ giữa Prisma, JWT guard và file storage.

### Cần đạt được gì?
1. ✅ `GET /users/me` — trả thông tin user đang đăng nhập (ẩn password)
2. ✅ `PATCH /users/me` — cập nhật name/bio (hoặc các field mở rộng trong tương lai)
3. ✅ `POST /users/me/change-password` — đổi mật khẩu với 3 bước xác thực
4. ✅ `POST /users/me/avatar` — upload avatar theo chuẩn multipart + giới hạn 5MB (NFR 9.1.2)

### Kỹ thuật sử dụng
- **Prisma `select`** để chỉ trả field cần thiết (tránh lộ password hash)
- **class-validator DTOs** cho profile + password
- **bcrypt** để verify/hash mật khẩu mới
- **Multer FileInterceptor** (từ `@nestjs/platform-express`) cho upload avatar + validate mimetype/size
- **Serve static assets** bằng `app.useStaticAssets` để FE truy cập `/uploads/avatars/...`

> 💡 Tất cả endpoints này đều yêu cầu JWT (`JwtAuthGuard`). Reuse `@CurrentUser()` để lấy `userId` giống Phase 1.

---

## Bước 1: Chuẩn bị thư mục & cấu hình upload

### Tại sao?
Avatar lưu ở local trong dev (theo NFR 9.1.4). Ta cần chỗ chứa cố định + config Multer để enforce size/mimetype ngay khi nhận file.

### Kỹ thuật
- Tạo thư mục `uploads/avatars` ngay tại root backend (`backend/uploads/avatars`)
- Dùng `diskStorage` của Multer để đặt tên file theo `userId-timestamp.ext`
- Giới hạn size `5 * 1024 * 1024`
- Chỉ chấp nhận `image/jpeg`, `image/png`, `image/gif`

### Code + Giải thích
📁 **File:** `src/common/config/multer.config.ts`

```typescript
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const avatarDir = join(process.cwd(), 'uploads', 'avatars');
if (!existsSync(avatarDir)) {
  mkdirSync(avatarDir, { recursive: true });
}

export const avatarMulterConfig = {
  storage: diskStorage({
    destination: avatarDir,
    filename: (_req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return callback(new Error('Only jpg/png/gif are allowed'));
    }
    callback(null, true);
  },
};
```

---

## Bước 2: Tạo DTOs cho profile & password

### Tại sao?
ValidationPipe (Phase 0) sẽ tự reject input sai format. Cần DTO riêng cho từng use case để giữ schema rõ ràng.

### Kỹ thuật
- Gắn `@IsOptional()` cho field không bắt buộc
- Regex password giống Phase 1 để đảm bảo độ mạnh
- `confirmPassword` sẽ được kiểm tra trong service (vì class-validator không biết field khác)

### Code + Giải thích
📁 **File:** `src/user/dto/update-profile.dto.ts`

```typescript
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Tên tối đa 50 ký tự' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'Bio tối đa 160 ký tự' })
  bio?: string;
}
```

📁 **File:** `src/user/dto/change-password.dto.ts`

```typescript
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu hiện tại' })
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải >= 8 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message: 'Mật khẩu mới phải có chữ hoa, chữ thường, số, ký tự đặc biệt',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng xác nhận mật khẩu mới' })
  confirmPassword: string;
}
```

---

## Bước 3: Viết UserService (business logic)

### Tại sao?
Service gom toàn bộ logic DB + bảo mật (hash password, xóa avatar cũ, revoke token). Controller chỉ forward request → service.

### Kỹ thuật
- Prisma `select` để tránh trả password hash
- `bcrypt.compare` / `bcrypt.hash`
- Dùng `fs/promises` để xóa avatar cũ (nếu lưu file local)
- Sau khi đổi mật khẩu → revoke toàn bộ refresh tokens + blacklist access token hiện tại (reuse bảng `invalidatedToken`)

### Code + Giải thích
📁 **File:** `src/user/user.service.ts`

```typescript
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly profileSelect = {
    id: true,
    email: true,
    name: true,
    avatar: true,
    status: true,
    bio: true,
    emailVerified: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.profileSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!dto.name && !dto.bio) {
      throw new BadRequestException('Không có dữ liệu để cập nhật');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name ? { name: dto.name.trim() } : {}),
        ...(dto.bio ? { bio: dto.bio.trim() } : {}),
      },
      select: this.profileSelect,
    });

    return updated;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Xác nhận mật khẩu không khớp');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matches = await bcrypt.compare(dto.currentPassword, user.password);
    if (!matches) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
    }

    const isSame = await bcrypt.compare(dto.newPassword, user.password);
    if (isSame) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu cũ');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password changed successfully' };
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File avatar không tồn tại');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    const storedPath = `uploads/avatars/${file.filename}`;
    const publicPath = `/${storedPath}`;
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: publicPath },
      select: this.profileSelect,
    });

    if (user?.avatar) {
      const absolutePath = join(process.cwd(), user.avatar.replace(/^\//, ''));
      await fs.rm(absolutePath, { force: true });
    }

    return updated;
  }
}
```

> ⚠️ Store path trong DB ở dạng `/uploads/...` để FE dùng trực tiếp, nhưng khi xóa file nhớ bỏ dấu `/` đầu tiên trước khi `path.join` (như ví dụ trên).

---

## Bước 4: Viết UserController

### Tại sao?
Controller định nghĩa endpoints theo API Spec 3.2–3.4 (PRD). Áp dụng `@UseGuards(JwtAuthGuard)` toàn controller và dùng decorator `@CurrentUser()`.

### Kỹ thuật
- `@Get('me')`, `@Patch('me')`, `@Post('me/change-password')`, `@Post('me/avatar')`
- `@UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))`
- `ParseFilePipe` để validate size/mimetype ngay tại controller (double check cùng Multer)

### Code + Giải thích
📁 **File:** `src/user/user.controller.ts`

```typescript
import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarMulterConfig } from '../common/config/multer.config';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getProfile(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, dto);
  }

  @Post('me/change-password')
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, dto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
  uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(userId, file);
  }
}
```

---

## Bước 5: Cập nhật UserModule

### Tại sao?
Module phải đăng ký controller, service, và Multer config. Tách biệt dependency để module tự chứa logic user.

### Kỹ thuật
- Import `MulterModule.register(avatarMulterConfig)` để DI hoạt động
- Export UserService nếu module khác cần (ví dụ Notification module send name)

### Code + Giải thích
📁 **File:** `src/user/user.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { avatarMulterConfig } from '../common/config/multer.config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MulterModule.register(avatarMulterConfig)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

> Đừng quên import `UserModule` vào `AppModule` (nếu chưa). Vì PrismaModule đã global, không cần làm gì thêm.

---

## Bước 6: Cho phép truy cập file avatar từ browser

### Tại sao?
Sau khi upload, FE cần URL công khai (`/uploads/avatars/<file>`). Nest phải expose folder uploads dưới dạng static assets.

### Kỹ thuật
- Sử dụng `NestExpressApplication`
- `app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' })`

### Code + Giải thích
📁 **File:** `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// ...existing imports

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // ...existing global pipes/interceptors/filters

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
```

---

## Bước 7: Cập nhật Hoppscotch Collection

### Tại sao?
Testing team cần import collection có đủ endpoints Phase 2.

### Kỹ thuật
- Mở `backend/docs/hoppscotch-collection.json`
- Thêm tag `User` đã có → append paths:
  - `GET /users/me`
  - `PATCH /users/me`
  - `POST /users/me/change-password`
  - `POST /users/me/avatar` (type multipart, form-data sample)
- Reuse schema `UserProfileResponse` (tạo mới nếu cần)

### Gợi ý snippet (rút gọn)
```json
"/users/me": {
  "get": {
    "tags": ["User"],
    "summary": "Lấy hồ sơ cá nhân",
    "responses": {
      "200": {
        "description": "Profile",
        "content": { "application/json": { "$ref": "#/components/schemas/UserProfile" } }
      }
    }
  }
}
```

---

## Bước 8: Test nhanh

1. `npm run start:dev`
2. Swagger `Authorize` với access token từ Phase 1
3. `GET /api/v1/users/me` → trả profile hiện tại
4. `PATCH /api/v1/users/me` với `{ "name": "John Updated" }` → verify `updatedAt` đổi
5. `POST /api/v1/users/me/change-password`:
   - Sai `currentPassword` → 400
   - `newPassword == confirmPassword` + khác mật khẩu cũ → 200
6. `POST /api/v1/users/me/avatar` (multipart) với file 4MB jpg → 200 + avatar url
7. Dùng file 6MB hoặc PDF → 400 (ParseFilePipe chặn)
8. Mở `http://localhost:3333/uploads/avatars/<filename>` trên browser → ảnh hiển thị

---

## Checklist Phase 2

- [ ] Tạo `src/common/config/multer.config.ts`
- [ ] Thêm DTOs `UpdateProfileDto`, `ChangePasswordDto`
- [ ] Viết `UserService` với 4 method chính
- [ ] Viết `UserController` (4 endpoints, guard toàn controller)
- [ ] Update `UserModule` + import vào `AppModule`
- [ ] Bổ sung `useStaticAssets` trong `main.ts`
- [ ] Thêm endpoints vào Hoppscotch collection
- [ ] Test chuỗi: profile → update → change password → upload avatar

---

## Q&A

**Q1: Có cần cho phép đổi email?**
> Chưa. Theo PRD Phase 2 chỉ chỉnh name/bio. Nếu đổi email → phải xử lý re-verify, sẽ lên Phase sau.

**Q2: Sau khi đổi mật khẩu có cần logout user?**
> Có. Ta đã revoke toàn bộ refresh token. FE nên gọi lại `/auth/login` để lấy token mới.

**Q3: Prod có xóa file avatar cũ không?**
> Có — `fs.rm` chạy sau khi cập nhật DB. Khi chuyển sang S3, thay đoạn này bằng SDK deleteObject.

**Q4: Làm sao mock upload trên test?**
> Dùng `supertest` với `.attach('avatar', path.join(__dirname, 'fixtures/avatar.png'))`. Nest/Multer xử lý tương tự môi trường thật.
