# Hướng dẫn Code — Phase 2: User Module

## Tổng quan Phase 2

### Chúng ta đang làm gì?
Sau khi Auth hoạt động ổn định (Phase 1), Phase 2 tập trung vào **User Module** để user có thể xem/cập nhật hồ sơ cá nhân, đổi mật khẩu và upload avatar. Đây là module đầu tiên sử dụng dữ liệu thực tế từ bảng `users`, nên phải xử lý đồng bộ giữa Prisma, JWT guard và file storage.

### Cần đạt được gì?
1. `GET /users/me` — trả thông tin user đang đăng nhập (ẩn password)
2. `PATCH /users/me` — cập nhật name/bio
3. `POST /users/me/change-password` — đổi mật khẩu với 3 bước xác thực
4. `POST /users/me/avatar` — upload avatar theo chuẩn multipart + giới hạn 5MB

### Kỹ thuật sử dụng
- **Prisma `select`** để chỉ trả field cần thiết (tránh lộ password hash)
- **class-validator DTOs** cho profile + password
- **bcrypt** để verify/hash mật khẩu mới
- **Multer FileInterceptor** cho upload avatar + validate mimetype/size
- **Serve static assets** bằng `app.useStaticAssets` để FE truy cập `/uploads/avatars/...`

> Tất cả endpoints này đều yêu cầu JWT (`JwtAuthGuard`). Reuse `@CurrentUser()` để lấy `userId` giống Phase 1.

---

## Bước 1: Chuẩn bị thư mục & cấu hình upload

### Tại sao cần bước này?

Khi user upload avatar, file đó phải được lưu vào đâu đó trên máy chủ. Trong môi trường dev, ta lưu vào folder `uploads/avatars/` ngay trong project. Tuy nhiên có vấn đề: **folder đó chưa chắc đã tồn tại** — nếu đây là lần đầu clone repo về, folder `uploads/` không có trong git (thường bị ignore), và Multer sẽ crash khi cố ghi file vào một nơi không tồn tại.

Bước này giải quyết 2 việc:
1. **Đảm bảo folder tồn tại** trước khi Multer cần dùng
2. **Cấu hình Multer** — quy định file lưu ở đâu, đặt tên ra sao, giới hạn size và loại file nào được chấp nhận

### Code + Giải thích từng dòng

📁 **File:** `src/common/config/multer.config.ts`

```typescript
import { diskStorage } from 'multer';
// diskStorage là strategy của Multer để lưu file lên ổ đĩa (disk).
// Multer có 2 strategy: diskStorage (lưu file) và memoryStorage (giữ trong RAM).
// Ta dùng diskStorage vì muốn file thật sự nằm trong folder uploads/.

import { extname, join } from 'path';
// extname: lấy đuôi file. Ví dụ extname('photo.jpg') → '.jpg'
// join: ghép đường dẫn theo đúng chuẩn OS.
// Tại sao không dùng string thủ công như 'uploads/avatars'?
// → Trên Windows dùng '\', trên Mac/Linux dùng '/'. join() tự xử lý điều này.

import { existsSync, mkdirSync } from 'fs';
// existsSync: kiểm tra xem 1 đường dẫn có tồn tại không (trả true/false)
// mkdirSync: tạo thư mục. Phiên bản Sync = chạy đồng bộ (chặn luồng cho đến khi xong)
// Ta dùng Sync ở đây vì đây là code khởi tạo — chạy 1 lần khi app start, không cần async.


// ─── Tự tạo folder nếu chưa có ───────────────────────────────────────────────

const avatarDir = join(process.cwd(), 'uploads', 'avatars');
// process.cwd() → trả về thư mục làm việc hiện tại khi chạy app.
// Ví dụ nếu bạn chạy `npm run start:dev` từ thư mục `backend/`,
// thì process.cwd() = 'D:/IT/Projects/CCNLTHD/backend'
// → avatarDir = 'D:/IT/Projects/CCNLTHD/backend/uploads/avatars'
//
// Tại sao không hardcode đường dẫn như 'C:/myproject/uploads/avatars'?
// → Vì mỗi người trong team clone repo vào chỗ khác nhau.
// process.cwd() luôn đúng bất kể máy nào.

if (!existsSync(avatarDir)) {
  // Kiểm tra: nếu folder avatarDir CHƯA tồn tại thì mới tạo.
  // Tại sao phải kiểm tra trước? mkdirSync sẽ báo lỗi nếu folder đã tồn tại rồi.
  mkdirSync(avatarDir, { recursive: true });
  // recursive: true → tạo tất cả các folder trung gian nếu cần.
  // Ví dụ nếu 'uploads/' cũng chưa có, thì tạo luôn cả 'uploads/' rồi mới tạo 'avatars/' bên trong.
  // Nếu không có { recursive: true }, và 'uploads/' chưa tồn tại → sẽ lỗi vì không tạo được folder con khi cha chưa có.
}


// ─── Cấu hình Multer ─────────────────────────────────────────────────────────

export const avatarMulterConfig = {
  storage: diskStorage({
    destination: avatarDir,
    // destination: Multer sẽ lưu file vào thư mục này.
    // Đây chính là avatarDir ta vừa đảm bảo là đã tồn tại ở trên.

    filename: (_req, file, callback) => {
      // Hàm này quyết định file sẽ được lưu với TÊN GÌ trên ổ đĩa.
      // Tại sao không dùng tên gốc (file.originalname)?
      // → Vì nếu 2 user cùng upload file tên 'avatar.jpg', file sau sẽ ghi đè file trước!
      // → Tên file gốc có thể chứa ký tự đặc biệt hoặc tiếng Việt → gây lỗi trên một số OS.
      // Giải pháp: tạo tên file độc nhất từ timestamp + số ngẫu nhiên.

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      // Date.now() → timestamp tính bằng milliseconds. Ví dụ: 1741939200000
      // Math.random() * 1e9 → số ngẫu nhiên từ 0 đến 1,000,000,000. Ví dụ: 472839201
      // Kết hợp lại: '1741939200000-472839201' → gần như không thể trùng

      callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      // callback(lỗi, tên-file) — đây là cách Multer truyền kết quả bất đồng bộ.
      // null ở tham số đầu nghĩa là "không có lỗi".
      // file.fieldname → tên của field trong form-data. Ở đây là 'avatar'.
      // extname(file.originalname) → giữ đuôi file gốc. Ví dụ: '.jpg', '.png'
      // Kết quả ví dụ: 'avatar-1741939200000-472839201.jpg'
    },
  }),

  limits: { fileSize: 5 * 1024 * 1024 },
  // Giới hạn size file tối đa.
  // 5 * 1024 * 1024 = 5,242,880 bytes = 5MB
  // Viết dạng tính toán thay vì số thô (5242880) để dễ đọc và sửa sau này.
  // Nếu file vượt quá → Multer tự reject trước khi file được lưu → tiết kiệm disk I/O.

  fileFilter: (_req, file, callback) => {
    // fileFilter chạy TRƯỚC KHI file được lưu xuống disk.
    // Dùng để chặn các loại file không mong muốn.

    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    // mimetype là loại file theo chuẩn MIME. Trình duyệt gửi kèm khi upload.
    // Ví dụ: file .jpg → 'image/jpeg', file .pdf → 'application/pdf'

    if (!allowed.includes(file.mimetype)) {
      // Nếu loại file không nằm trong danh sách cho phép → từ chối
      return callback(new Error('Only jpg/png/gif are allowed'));
      // Truyền Error vào callback → Multer hiểu là từ chối file này
    }
    callback(null, true);
    // null = không lỗi, true = chấp nhận file này → Multer tiếp tục lưu
  },
};
```

---

## Bước 2: Tạo DTOs cho profile & password

### Tại sao cần DTO?

DTO (Data Transfer Object) là class định nghĩa **shape** (hình dạng) của data đến từ request body. Kết hợp với `ValidationPipe` (đã setup ở Phase 0), NestJS sẽ tự động kiểm tra và từ chối request có data sai format — **trước khi vào service**. Nếu không có DTO, bạn phải tự viết hàng tá `if` trong service để check từng field.

### Tại sao cần DTO riêng cho từng use case?

- `UpdateProfileDto`: chỉ cho phép sửa `name` và `bio` — không thể sửa email hay password qua endpoint này
- `ChangePasswordDto`: cần `currentPassword` để xác minh danh tính trước khi đổi

Nếu dùng chung 1 DTO → khó kiểm soát ai được sửa field gì.

### Code + Giải thích từng dòng

📁 **File:** `src/user/dto/update-profile.dto.ts`

```typescript
import { IsOptional, IsString, MaxLength } from 'class-validator';
// class-validator: thư viện dùng decorator để validate data.
// Khi ValidationPipe chạy, nó gọi class-validator để kiểm tra từng field.

export class UpdateProfileDto {
  @IsOptional()
  // Decorator này báo: field này KHÔNG BẮT BUỘC phải có trong request.
  // Nếu không có @IsOptional() và user gửi request không kèm 'name' → bị reject.
  // Tại sao cần @IsOptional() ở đây?
  // → Vì user có thể chỉ muốn cập nhật bio mà không cần gửi name (và ngược lại).

  @IsString()
  // Đảm bảo nếu 'name' được gửi lên, nó phải là kiểu string.
  // Ngăn trường hợp ai đó gửi: { "name": 12345 } hoặc { "name": ["hack"] }

  @MaxLength(50, { message: 'Tên tối đa 50 ký tự' })
  // Giới hạn độ dài tối đa. { message: '...' } là custom error message.
  // Nếu không có message custom → error message mặc định của thư viện bằng tiếng Anh.
  name?: string;
  // Dấu ? trong TypeScript có nghĩa là field này optional (có thể undefined).
  // Phải match với @IsOptional() ở trên — nếu không có ? mà có @IsOptional()
  // thì TypeScript sẽ cảnh báo type mismatch.

  @IsOptional()
  @IsString()
  @MaxLength(160, { message: 'Bio tối đa 160 ký tự' })
  // 160 ký tự — bằng giới hạn Twitter bio, đủ cho 1 câu giới thiệu ngắn.
  bio?: string;
}
```

📁 **File:** `src/user/dto/change-password.dto.ts`

```typescript
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu hiện tại' })
  // @IsNotEmpty() kiểm tra field không được là chuỗi rỗng "".
  // Tại sao cần cả @IsString() và @IsNotEmpty()?
  // → @IsString() chặn non-string (số, array...).
  // → @IsNotEmpty() chặn chuỗi rỗng "" (vẫn là string nhưng không hợp lệ).
  currentPassword: string;
  // Không có ? → field này BẮT BUỘC phải có trong request body.

  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải >= 8 ký tự' })
  // MinLength: độ dài tối thiểu.

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message: 'Mật khẩu mới phải có chữ hoa, chữ thường, số, ký tự đặc biệt',
  })
  // @Matches() kiểm tra string có khớp với regex không.
  // Giải thích regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
  // (?=.*[a-z])     → phải có ít nhất 1 chữ thường
  // (?=.*[A-Z])     → phải có ít nhất 1 chữ hoa
  // (?=.*\d)        → phải có ít nhất 1 chữ số
  // (?=.*[@$!%*?&]) → phải có ít nhất 1 ký tự đặc biệt trong danh sách
  // Đây là "lookahead assertions" — không consume ký tự, chỉ kiểm tra điều kiện.
  // Regex này giống hệt Phase 1 để đảm bảo chính sách mật khẩu nhất quán.
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng xác nhận mật khẩu mới' })
  confirmPassword: string;
  // Tại sao không validate confirmPassword === newPassword ở đây?
  // → class-validator chỉ biết thông tin của từng field riêng lẻ,
  //   không thể so sánh 2 field với nhau trong cùng 1 decorator.
  // → Việc kiểm tra newPassword === confirmPassword sẽ làm trong SERVICE.
}
```

---

## Bước 3: Viết UserService (business logic)

### Tại sao tách Service riêng?

Controller chỉ nên làm 1 việc: nhận request, gọi service, trả response. Toàn bộ logic phức tạp (query DB, hash password, xóa file...) nằm trong service. Lý do:
- Dễ test riêng lẻ (có thể test service mà không cần chạy HTTP server)
- Dễ tái sử dụng (service khác có thể gọi `UserService.getProfile()` mà không cần đi qua HTTP)

### Code + Giải thích từng dòng

📁 **File:** `src/user/user.service.ts`

```typescript
import {
  BadRequestException,  // Lỗi 400 — client gửi data sai
  Injectable,           // Decorator để NestJS biết class này có thể được inject
  NotFoundException,    // Lỗi 404 — không tìm thấy resource
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
// bcrypt: thuật toán hash một chiều cho mật khẩu.
// "Một chiều" nghĩa là không thể giải mã hash ra mật khẩu gốc.
// Cách verify: hash mật khẩu người dùng nhập vào → so sánh với hash trong DB.

import { promises as fs } from 'fs';
// import promises từ fs để dùng API async/await thay vì callback.
// Đặt alias là 'fs' để gọi như: fs.rm(), fs.unlink()...
// Tại sao dùng async? → Xóa file là I/O operation — nên dùng async để không block server.

import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
// @Injectable() → đăng ký class này vào DI container của NestJS.
// NestJS sẽ tự tạo instance và inject vào chỗ nào cần (ví dụ: UserController).
export class UserService {
  constructor(private prisma: PrismaService) {}
  // private prisma: PrismaService → NestJS tự inject PrismaService vào đây.
  // Nhờ đó ta có thể gọi this.prisma.user.findUnique() ở bất kỳ method nào.


  // ─── profileSelect ───────────────────────────────────────────────────────────

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
    // Chú ý: 'password' KHÔNG có ở đây.
  } as const;
  // Tại sao tạo object này thay vì viết trực tiếp trong query?
  // → Tránh lặp code: getProfile, updateProfile, uploadAvatar đều trả cùng shape.
  //   Nếu sau này muốn thêm field (ví dụ: 'phone'), chỉ sửa 1 chỗ này.
  // 'as const' → TypeScript hiểu đây là literal type, giúp type-check chính xác hơn.
  //
  // Tại sao KHÔNG include 'password'?
  // → Mật khẩu đã được hash nhưng vẫn là dữ liệu nhạy cảm.
  //   Nếu vô tình trả về trong response, dù là hash thì cũng tạo ra rủi ro bảo mật.
  //   Prisma 'select' đảm bảo field không được chọn → không có trong query result.


  // ─── getProfile ──────────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      // findUnique: tìm đúng 1 record theo unique field (id là primary key).
      // Khác với findFirst (tìm record đầu tiên match điều kiện) — ở đây dùng findUnique vì id là unique.
      select: this.profileSelect,
      // select: chỉ lấy những field được liệt kê.
      // Prisma sẽ tạo câu SQL: SELECT id, email, name, avatar, ... FROM users WHERE id = $1
      // (KHÔNG có cột password trong câu SELECT → không bao giờ load lên server).
    });
    if (!user) {
      throw new NotFoundException('User not found');
      // Tại sao cần check null?
      // → Trong lý thuyết, userId lấy từ JWT nên luôn tồn tại.
      //   Nhưng nếu admin xóa account mà user vẫn giữ token cũ → userId không còn trong DB.
      // NotFoundException → NestJS tự trả HTTP 404 kèm message.
    }
    return user;
  }


  // ─── updateProfile ────────────────────────────────────────────────────────────

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!dto.name && !dto.bio) {
      throw new BadRequestException('Không có dữ liệu để cập nhật');
      // Tại sao check này?
      // → Cả 2 field đều @IsOptional() → user có thể gửi request body rỗng {}.
      //   Nếu không check, ta sẽ gọi prisma.user.update() với data: {} → vô nghĩa.
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name ? { name: dto.name.trim() } : {}),
        // Spread conditional object:
        // Nếu dto.name có giá trị → thêm { name: 'giá trị đã trim' } vào data
        // Nếu dto.name undefined → thêm {} (không làm gì)
        // .trim() → xóa khoảng trắng đầu/cuối. Ví dụ: '  John  ' → 'John'
        // Tại sao không dùng data: dto trực tiếp?
        // → Nếu dto.name = undefined và ta set name: undefined → Prisma sẽ set field thành NULL trong DB!
        //   Spread conditional đảm bảo chỉ update field nào thực sự được gửi lên.
        ...(dto.bio ? { bio: dto.bio.trim() } : {}),
      },
      select: this.profileSelect,
      // Trả về profile mới sau khi update — tiện cho FE update state ngay mà không cần gọi thêm GET.
    });

    return updated;
  }


  // ─── changePassword ───────────────────────────────────────────────────────────

  async changePassword(userId: string, dto: ChangePasswordDto) {
    // Bước 1: Kiểm tra confirmPassword
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Xác nhận mật khẩu không khớp');
      // Check này đáng lẽ nên làm ở DTO nhưng class-validator không hỗ trợ cross-field validation.
      // → Làm ở service là đúng chỗ.
    }

    // Bước 2: Lấy password hash từ DB
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
      // Lần này ta CHỈ lấy password — không cần các field khác.
      // Tại sao dùng select thay vì lấy toàn bộ user?
      // → Tối ưu: chỉ load data cần thiết từ DB. Ít data = nhanh hơn.
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Bước 3: Xác minh mật khẩu hiện tại
    const matches = await bcrypt.compare(dto.currentPassword, user.password);
    // bcrypt.compare(plaintext, hash) → trả true nếu plaintext hash ra đúng hash đó.
    // Tại sao không hash dto.currentPassword rồi so sánh string?
    // → bcrypt dùng "salt" ngẫu nhiên trong hash → cùng 1 password nhưng hash mỗi lần khác nhau.
    //   Nên KHÔNG thể so sánh bằng ===. Phải dùng bcrypt.compare() để nó tự xử lý salt.
    if (!matches) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
      // Không nên nói "User không tồn tại" hay thông tin cụ thể hơn → tránh leak thông tin.
    }

    // Bước 4: Đảm bảo mật khẩu mới khác mật khẩu cũ
    const isSame = await bcrypt.compare(dto.newPassword, user.password);
    if (isSame) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu cũ');
      // UX: đổi mật khẩu mà đặt y chang cũ thì vô nghĩa.
    }

    // Bước 5: Hash mật khẩu mới
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    // bcrypt.hash(plaintext, saltRounds)
    // saltRounds = 10 → bcrypt chạy 2^10 = 1024 vòng lặp để tạo hash.
    // Càng cao → càng an toàn nhưng càng chậm. 10 là chuẩn phổ biến (~100ms trên máy thường).
    // Kết quả: '$2b$10$...' — string 60 ký tự chứa cả salt + hash.

    // Bước 6: Lưu mật khẩu mới + revoke toàn bộ refresh tokens
    await this.prisma.$transaction([
      // $transaction([]) → chạy nhiều query trong 1 database transaction.
      // Nghĩa là: hoặc CẢ HAI thành công, hoặc CẢ HAI fail (rollback).
      // Tại sao cần transaction ở đây?
      // → Nếu update password thành công nhưng revoke token fail → user bị mất password mới
      //   mà token cũ vẫn còn hiệu lực → nguy hiểm. Transaction ngăn tình huống này.

      this.prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
        // Lưu hash mới vào DB. Mật khẩu cũ bị ghi đè hoàn toàn.
      }),

      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        // Lấy tất cả refresh tokens của user mà CHƯA bị revoke (revokedAt = null).
        data: { revokedAt: new Date() },
        // Đặt revokedAt = thời điểm hiện tại → đánh dấu là đã bị thu hồi.
        // Tại sao revoke refresh tokens?
        // → Nếu ai đó đánh cắp device của user và đang dùng refresh token cũ,
        //   sau khi user đổi mật khẩu → tất cả token cũ vô hiệu → kẻ tấn công bị đăng xuất.
      }),
    ]);

    return { message: 'Password changed successfully' };
    // Trả về message thay vì user object vì sau khi đổi mật khẩu, FE nên redirect về login.
  }


  // ─── uploadAvatar ─────────────────────────────────────────────────────────────

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    // Express.Multer.File: TypeScript type cho file đã được Multer xử lý.
    // Object này có các field: fieldname, originalname, mimetype, size, filename, path...

    if (!file) {
      throw new BadRequestException('File avatar không tồn tại');
      // Tại sao check null ở đây dù ParseFilePipe đã validate ở controller?
      // → Defense in depth: service không nên tin tưởng rằng caller đã validate đúng.
      //   Nếu sau này có code gọi uploadAvatar() không qua HTTP (ví dụ: test, script), vẫn an toàn.
    }

    // Lấy avatar cũ của user (nếu có) để xóa sau
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
      // Chỉ lấy field avatar — không cần load cả profile.
    });

    // Tạo đường dẫn để lưu vào DB và trả về cho FE
    const storedPath = `uploads/avatars/${file.filename}`;
    // file.filename: tên file đã được Multer đặt theo logic ở multer.config.ts
    // Ví dụ: 'avatar-1741939200000-472839201.jpg'

    const publicPath = `/${storedPath}`;
    // Thêm '/' ở đầu để thành URL path tuyệt đối.
    // Ví dụ: '/uploads/avatars/avatar-1741939200000-472839201.jpg'
    // FE sẽ dùng: `http://localhost:3333${publicPath}` để hiển thị ảnh.

    // Cập nhật avatar trong DB
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: publicPath },
      select: this.profileSelect,
    });

    // Xóa avatar cũ khỏi disk (nếu user đã có avatar trước đó)
    if (user?.avatar) {
      // user?.avatar: optional chaining — nếu user là null thì không crash, trả undefined.

      const absolutePath = join(process.cwd(), user.avatar.replace(/^\//, ''));
      // user.avatar là '/uploads/avatars/old-file.jpg' (có dấu / đầu).
      // .replace(/^\//, '') → xóa dấu / đầu → 'uploads/avatars/old-file.jpg'
      // join(process.cwd(), ...) → ghép thành đường dẫn tuyệt đối trên OS.
      // Tại sao phải xóa dấu / đầu?
      // → join('/home/app', '/uploads/avatars/file.jpg') trên Linux
      //   → kết quả là '/uploads/avatars/file.jpg' (bỏ qua phần trước dấu /)
      //   → Sai! Nên phải bỏ dấu / trước khi join.

      await fs.rm(absolutePath, { force: true });
      // fs.rm() xóa file. { force: true } → không báo lỗi nếu file không tồn tại.
      // Tại sao dùng force: true?
      // → Nếu file bị xóa thủ công từ disk, không muốn server crash vì lỗi "file not found".
      //
      // Tại sao xóa avatar cũ SAU KHI update DB thành công?
      // → Nếu xóa file trước rồi DB update fail → user mất ảnh cũ mà ảnh mới không được lưu → mất data.
      //   Thứ tự: DB trước, disk sau là an toàn hơn.
    }

    return updated;
  }
}
```

---

## Bước 4: Viết UserController

### Tại sao Controller cần ít code như vậy?

Controller chỉ làm 3 việc: (1) nhận HTTP request, (2) gọi service, (3) trả kết quả. Toàn bộ logic nằm trong service. Controller "mỏng" (thin controller) là best practice trong NestJS.

### Code + Giải thích từng dòng

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
// @Controller('users') → tất cả routes trong class này đều bắt đầu bằng /users
// Kết hợp với prefix /api/v1 trong main.ts → URL đầy đủ: /api/v1/users/...

@UseGuards(JwtAuthGuard)
// Đặt guard ở cấp controller → áp dụng cho TẤT CẢ endpoints trong class.
// Tại sao không đặt riêng từng endpoint?
// → Tất cả user endpoints đều cần xác thực → đặt 1 lần cho gọn.
// → Nếu sau này thêm endpoint mới, tự động được bảo vệ mà không cần nhớ thêm guard.
export class UserController {
  constructor(private readonly userService: UserService) {}
  // NestJS inject UserService vào đây. 'readonly' → không thể reassign sau khi inject.


  @Get('me')
  // Route: GET /api/v1/users/me
  getProfile(@CurrentUser('id') userId: string) {
    // @CurrentUser('id'): decorator từ Phase 1 — lấy field 'id' từ JWT payload.
    // JWT payload đã được JwtAuthGuard verify và gắn vào request.user.
    // Tại sao lấy userId từ JWT thay vì từ URL params?
    // → An toàn hơn: user không thể giả mạo userId của người khác.
    //   Nếu dùng route /users/:id thì bất kỳ ai cũng có thể thử /users/uuid-khac.
    return this.userService.getProfile(userId);
    // NestJS tự serialize kết quả thành JSON và trả về với status 200.
  }

  @Patch('me')
  // Route: PATCH /api/v1/users/me
  // Dùng PATCH (không phải PUT) vì chỉ cập nhật một phần (partial update).
  // PUT thường thay thế toàn bộ resource.
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
    // @Body() → lấy request body và tự động validate theo UpdateProfileDto.
    // ValidationPipe (global) sẽ gọi class-validator → reject nếu data sai.
  ) {
    return this.userService.updateProfile(userId, dto);
  }

  @Post('me/change-password')
  // Route: POST /api/v1/users/me/change-password
  // Dùng POST vì thao tác này có side effect (thay đổi state) và không idempotent.
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, dto);
  }

  @Post('me/avatar')
  // Route: POST /api/v1/users/me/avatar
  @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
  // @UseInterceptors(): NestJS sẽ chạy interceptor này trước khi vào method.
  // FileInterceptor('avatar', config):
  //   - 'avatar': tên của field trong form-data (client phải gửi đúng tên này).
  //   - avatarMulterConfig: config ta viết ở Bước 1 (destination, filename, limits, filter).
  // Interceptor xử lý multipart/form-data → parse file → lưu vào disk → gắn vào request.
  uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile(
      // @UploadedFile(): lấy file đã được Multer xử lý từ request.
      new ParseFilePipe({
        // ParseFilePipe: validation pipe riêng cho file upload.
        // Chạy sau khi Multer đã lưu file → nếu fail thì file đã được lưu nhưng endpoint trả lỗi.
        // Tại sao cần validate 2 lần (cả trong multerConfig và ParseFilePipe)?
        // → multerConfig.fileFilter chạy TRƯỚC khi lưu → chặn sớm, tốt cho performance.
        // → ParseFilePipe chạy SAU → đây là tầng validation của NestJS, trả lỗi chuẩn hơn.
        // → Double check = an toàn hơn.
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // Kiểm tra file size <= 5MB. Cùng giới hạn với multerConfig.limits.fileSize.

          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
          // Kiểm tra tên file có đuôi hợp lệ. Dùng regex match phần đuôi file.
          // Lưu ý: validator này check theo tên file, multerConfig.fileFilter check theo mimetype.
          // Hai cách check bổ sung cho nhau — tránh tình huống rename file để bypass.
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

### Tại sao cần Module?

Trong NestJS, mọi thứ phải được khai báo trong một Module thì mới hoạt động. Module là cách NestJS tổ chức các component (controller, service, guard...) thành nhóm có liên quan. Nếu không khai báo trong module, NestJS không biết class đó tồn tại và sẽ không inject được.

### Code + Giải thích từng dòng

📁 **File:** `src/user/user.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
// MulterModule: NestJS wrapper cho Multer, cần register để FileInterceptor hoạt động.

import { avatarMulterConfig } from '../common/config/multer.config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MulterModule.register(avatarMulterConfig)],
  // MulterModule.register(): đăng ký Multer với config vào DI container của module này.
  // Nhờ đây, FileInterceptor trong UserController mới biết dùng config nào.
  // Nếu không có dòng này → FileInterceptor không có config → có thể báo lỗi hoặc dùng config mặc định (không an toàn).

  controllers: [UserController],
  // Khai báo controllers trong module. NestJS sẽ tạo instance và đăng ký routes.

  providers: [UserService],
  // Khai báo providers (services, guards, ...) trong module.
  // NestJS sẽ tạo instance của UserService và sẵn sàng inject khi cần.

  exports: [UserService],
  // Export UserService để các module khác có thể inject và sử dụng.
  // Ví dụ: NotificationModule sau này cần user name để gửi thông báo → import UserModule → dùng UserService.getProfile().
  // Nếu không có exports → UserService chỉ dùng được bên trong UserModule.
})
export class UserModule {}
```

> **Đừng quên:** import `UserModule` vào `AppModule` (file `src/app.module.ts`). Vì `PrismaModule` đã được khai báo global (Phase 0), `UserService` dùng `PrismaService` mà không cần import thêm gì.

---

## Bước 6: Cho phép truy cập file avatar từ browser

### Tại sao cần bước này?

Sau khi upload, Multer lưu file vào `backend/uploads/avatars/filename.jpg`. Nhưng NestJS mặc định **không expose** folder nào ra ngoài — nếu browser gõ `http://localhost:3333/uploads/avatars/filename.jpg`, sẽ nhận được 404.

Bước này bật tính năng "static file serving" — NestJS sẽ serve các file tĩnh trong folder `uploads/` giống như một web server thông thường.

### Code + Giải thích từng dòng

📁 **File:** `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// NestExpressApplication: type đặc biệt của NestJS app khi dùng Express adapter.
// Tại sao cần import thêm type này?
// → NestFactory.create() mặc định trả về INestApplication.
//   Muốn dùng app.useStaticAssets() (feature của Express), phải cast sang NestExpressApplication.
//   Nếu không có type này → TypeScript báo lỗi vì INestApplication không có method useStaticAssets.

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // <NestExpressApplication>: generic type parameter.
  // Báo cho TypeScript biết: "app này là NestExpressApplication, không phải INestApplication".
  // → Mở khoá các method đặc trưng của Express như useStaticAssets().

  // ...existing code (global pipes, prefix, cors, ...)

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  // useStaticAssets(folder, options):
  //   - Tham số 1: đường dẫn tuyệt đối đến folder chứa static files.
  //     join(process.cwd(), 'uploads') → ví dụ: 'D:/IT/Projects/CCNLTHD/backend/uploads'
  //   - prefix: '/uploads/' → URL path để truy cập.
  //
  // Cách hoạt động:
  //   Request: GET http://localhost:3333/uploads/avatars/avatar-123.jpg
  //   NestJS: tìm file tại D:/IT/.../backend/uploads/avatars/avatar-123.jpg → trả về file đó.
  //
  // Tại sao prefix là '/uploads/' không phải '/'?
  //   → Nếu prefix là '/', browser có thể truy cập MỌI file trong folder uploads/.
  //     Với prefix '/uploads/', URL phải bắt đầu bằng /uploads/ mới được serve.
  //     Nếu sau này thêm subfolder uploads/private/ thì vẫn kiểm soát được.

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
```

---

## Bước 7: Test nhanh với Hoppscotch

Chạy server: `npm run start:dev`, rồi test theo thứ tự:

1. **Login** (từ Phase 1) → copy `accessToken`
2. **GET /api/v1/users/me** → phải trả profile, không có field `password`
3. **PATCH /api/v1/users/me** với `{ "name": "John Updated" }` → verify `updatedAt` thay đổi
4. **POST /api/v1/users/me/change-password**:
   - Sai `currentPassword` → 400
   - `newPassword !== confirmPassword` → 400
   - Đúng tất cả → 200, login lại bằng password mới
5. **POST /api/v1/users/me/avatar** (chọn Content-Type: multipart/form-data, field name: `avatar`):
   - File jpg/png dưới 5MB → 200, nhận về `avatar: '/uploads/avatars/...'`
   - File PDF hoặc trên 5MB → 400
6. **Mở browser**: `http://localhost:3333/uploads/avatars/<filename>` → ảnh hiển thị trực tiếp

---

## Checklist Phase 2

- [ ] Tạo `src/common/config/multer.config.ts`
- [ ] Thêm DTOs `UpdateProfileDto`, `ChangePasswordDto`
- [ ] Viết `UserService` với 4 method chính
- [ ] Viết `UserController` (4 endpoints, guard toàn controller)
- [ ] Update `UserModule` + import vào `AppModule`
- [ ] Bổ sung `useStaticAssets` trong `main.ts`
- [ ] Test chuỗi: profile → update → change password → upload avatar

---

## Q&A

**Q1: Có cần cho phép đổi email không?**
> Chưa. Theo PRD Phase 2 chỉ sửa name/bio. Đổi email phức tạp hơn vì phải re-verify — để lên Phase sau.

**Q2: Sau khi đổi mật khẩu có cần logout user không?**
> Có. Ta đã revoke toàn bộ refresh token trong DB. FE nên clear token khỏi localStorage rồi redirect về trang Login.

**Q3: Production có xóa file avatar cũ không?**
> Có — `fs.rm()` chạy sau khi update DB thành công. Khi chuyển sang S3 sau này, thay đoạn `fs.rm()` bằng `s3.deleteObject()` của AWS SDK.

**Q4: Tại sao xóa avatar cũ SAU KHI update DB?**
> An toàn hơn. Nếu xóa file trước → DB update fail → user mất ảnh cũ, ảnh mới không được lưu. Thứ tự đúng: update DB thành công → xóa file cũ.

**Q5: Multer và ParseFilePipe đều validate, cái nào chạy trước?**
> Multer (FileInterceptor) chạy trước: nhận multipart request, parse, check fileFilter, lưu file xuống disk. Sau đó ParseFilePipe chạy: kiểm tra lại size và type. Nếu ParseFilePipe fail, file đã được lưu nhưng endpoint vẫn trả lỗi — trường hợp này file "mồ côi" trên disk, nhưng vì multerConfig đã filter nghiêm trước đó, tình huống này hiếm xảy ra.
