<!-- Chèn vào: SAU section 7.4.3, TRƯỚC bài tập Chương 7 -->

### 7.4.4. Token Blacklist — Vô hiệu hóa Token tức thì

#### Vấn đề: JWT stateless và kịch bản nguy hiểm

Bản chất *stateless* của JWT là con dao hai lưỡi. Server không lưu trạng thái session, giúp hệ thống dễ scale — nhưng đồng thời cũng có nghĩa server không thể "hủy" một token đã cấp. Hãy xem xét kịch bản sau: user A đăng nhập lúc 8:00 và nhận được access token có hiệu lực 15 phút. Lúc 9:00, user A nhấn nút logout. Tuy nhiên, nếu kẻ tấn công đã đánh cắp được access token trước đó (qua XSS, network sniffing, hoặc log file), kẻ tấn công vẫn có thể sử dụng token đó cho đến khi nó hết hạn — dù user đã logout.

Trong 15 phút đó, kẻ tấn công có toàn quyền truy cập API với tư cách user A: đọc thông tin cá nhân, sửa task, thậm chí mời thành viên vào workspace. Đây là lỗ hổng bảo mật nghiêm trọng mà bất kỳ hệ thống JWT nào cũng phải đối mặt.

#### Giải pháp: Token Blacklist với Prisma

Dự án TodoList Collaboration giải quyết vấn đề này bằng cơ chế **Token Blacklist** — một bảng trong database lưu danh sách các token đã bị vô hiệu hóa. Mỗi khi user logout, access token hiện tại được thêm vào blacklist. Mọi request tiếp theo sử dụng token đó sẽ bị từ chối ngay lập tức.

Đầu tiên, model `InvalidatedToken` trong Prisma schema định nghĩa cấu trúc bảng lưu token bị vô hiệu hóa:

```prisma
// backend/prisma/schema.prisma
model InvalidatedToken {
  id        String   @id @default(uuid())
  token     String   @unique        // Token bị blacklist — đánh index unique để tìm nhanh
  expiresAt DateTime                // Thời điểm token hết hạn — dùng để dọn dẹp records cũ
  reason    String?                 // Lý do vô hiệu hóa (LOGOUT, PASSWORD_CHANGE, ...)
  createdAt DateTime @default(now())

  @@index([expiresAt])              // Index theo expiresAt để cron job dọn nhanh
  @@map("invalidated_tokens")
}
```

Khi user gọi endpoint `POST /api/v1/auth/logout`, `AuthService.logout()` thực hiện hai việc: revoke tất cả refresh tokens và thêm access token hiện tại vào blacklist:

```typescript
// backend/src/modules/auth/auth.service.ts
async logout(userId: string, accessToken: string) {
  // Bước 1: Revoke TẤT CẢ refresh tokens của user này
  await this.prisma.refreshToken.updateMany({
    where: { userId: userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  // Bước 2: Thêm access token vào blacklist
  if (accessToken) {
    try {
      const decoded = this.jwtService.decode(accessToken);
      await this.prisma.invalidatedToken.create({
        data: {
          token: accessToken,
          expiresAt: new Date(decoded.exp * 1000), // ← QUAN TRỌNG
          reason: 'LOGOUT',
        },
      });
    } catch {
      // Nếu decode thất bại → token không hợp lệ, bỏ qua
    }
  }

  return { message: 'Logout successfully' };
}
```

Điểm đáng chú ý là `expiresAt` được tính từ field `exp` trong JWT payload. Field này cho biết thời điểm token tự hết hạn. Lưu giá trị này giúp cron job sau này có thể xóa các records đã hết hạn — vì token đã hết hạn không cần nằm trong blacklist nữa.

Phía kiểm tra, `JwtStrategy.validate()` — method được gọi mỗi khi có request cần xác thực — kiểm tra token có nằm trong blacklist không:

```typescript
// backend/src/modules/auth/strategies/jwt.strategy.ts
async validate(req: Request, payload: { sub: string; email: string }) {
  // ═══ TOKEN BLACKLIST CHECK ═══
  const token = req?.headers?.authorization?.replace('Bearer ', '');

  if (token) {
    const isInvalidated = await this.prisma.invalidatedToken.findUnique({
      where: { token },
    });
    if (isInvalidated) {
      throw new UnauthorizedException('Token is invalidated');
    }
  }

  return { id: payload.sub, email: payload.email };
}
```

Nếu token được tìm thấy trong bảng `invalidated_tokens`, strategy throw `UnauthorizedException` — request bị reject với HTTP 401 ngay lập tức, bất kể token chưa hết hạn.

#### Kết quả trước và sau khi có Token Blacklist

Bảng dưới đây so sánh hành vi hệ thống trước và sau khi triển khai Token Blacklist:

| Tình huống | **Không có Blacklist** | **Có Blacklist** |
|-----------|------------------------|------------------|
| User logout, kẻ tấn công dùng token cũ | Token vẫn hoạt động đến khi hết hạn | Token bị reject ngay lập tức (401) |
| User đổi mật khẩu | Token cũ vẫn hoạt động | Token cũ có thể được thêm vào blacklist |
| Admin vô hiệu hóa tài khoản | Token vẫn hoạt động | Thêm token vào blacklist, hiệu lực tức thì |

#### Trade-off và hướng tối ưu

Cơ chế Token Blacklist có một trade-off rõ ràng: **mỗi request được bảo vệ tốn thêm một database query** để kiểm tra blacklist. Với PostgreSQL, query này mất khoảng 1-3ms nhờ index trên column `token`, nhưng khi hệ thống có hàng nghìn request mỗi giây, overhead sẽ tích lũy đáng kể.

Trong môi trường production, có hai hướng tối ưu. Thứ nhất, thay thế PostgreSQL bằng **Redis** cho blacklist — Redis lưu dữ liệu trong RAM, thời gian truy vấn dưới 0.1ms, và hỗ trợ TTL (Time To Live) tự động xóa record hết hạn mà không cần cron job. Thứ hai, thiết lập **cron job** định kỳ dọn dẹp các token đã hết hạn trong bảng `invalidated_tokens`:

```sql
-- Xóa tokens đã hết hạn (chạy mỗi giờ)
DELETE FROM invalidated_tokens WHERE "expiresAt" < NOW();
```

Việc dọn dẹp định kỳ giúp bảng blacklist luôn nhỏ gọn, đảm bảo query kiểm tra luôn nhanh bất kể hệ thống đã hoạt động bao lâu.
