# BỔ SUNG VÀO CHƯƠNG 7 — TOKEN BLACKLIST

> **Hướng dẫn dán vào báo cáo:** Thêm section 7.4.4 này vào **sau section 7.4.3** (APP_GUARD), trước phần "7.5. Bài tập ứng dụng".

---

## 7.4.4. Token Blacklist — Vô hiệu hóa Token tức thì

### Vấn đề

JWT là **stateless** — server không lưu session. Một token hợp lệ sẽ tiếp tục hoạt động cho đến khi hết hạn (`exp`), dù user đã logout.

**Kịch bản nguy hiểm:**
1. User đăng nhập trên máy tính công ty, nhận token hết hạn sau 15 phút
2. User logout lúc 9:00
3. Kẻ tấn công đã capture được token lúc 8:58
4. Kẻ tấn công dùng token đó lúc 9:05 → **vẫn hoạt động** (token chưa hết hạn tự nhiên)

### Giải pháp: InvalidatedToken Table

Mỗi khi user logout, lưu token vào bảng `InvalidatedToken`. `JwtStrategy` kiểm tra blacklist trước mỗi request.

**Schema Prisma:**
```prisma
model InvalidatedToken {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime
  reason    String   @default("LOGOUT") // LOGOUT | BANNED | PASSWORD_CHANGED
  createdAt DateTime @default(now())

  @@map("invalidated_tokens")
}
```

**AuthService.logout():**
```typescript
async logout(userId: string, accessToken: string) {
  // 1. Revoke tất cả refresh tokens của user
  await this.prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  // 2. Thêm access token vào blacklist
  if (accessToken) {
    const decoded = this.jwtService.decode(accessToken);
    await this.prisma.invalidatedToken.create({
      data: {
        token: accessToken,
        expiresAt: new Date(decoded.exp * 1000), // Unix timestamp → ms
        reason: 'LOGOUT',
      },
    });
  }

  return { message: 'Logout successfully' };
}
```

**JwtStrategy.validate() — kiểm tra blacklist:**
```typescript
async validate(req: Request, payload: { sub: string; email: string }) {
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

### Kết quả

| Tình huống | Trước khi có Blacklist | Sau khi có Blacklist |
|-----------|----------------------|---------------------|
| User logout, dùng lại token cũ | ✅ Request thành công (nguy hiểm) | ❌ 401 "Token is invalidated" |
| Token hết hạn tự nhiên | ❌ 401 "jwt expired" | ❌ 401 "jwt expired" |
| Token hợp lệ, chưa logout | ✅ Request thành công | ✅ Request thành công |

### Trade-off và tối ưu

**Chi phí:** Mỗi request authenticated tốn thêm 1 DB query để kiểm tra blacklist.

**Tối ưu cho production:** Thay PostgreSQL bằng **Redis** (in-memory database):
```
SET invalidated:{token} 1 EX {ttl_seconds}
# Key tự động xóa sau khi token hết hạn — không cần cleanup job
```

**Dọn dẹp database định kỳ:** Nên có cron job xóa các record đã `expiresAt < now()` để tránh bảng phình to theo thời gian.
