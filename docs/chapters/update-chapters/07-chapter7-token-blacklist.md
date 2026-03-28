# BỔ SUNG VÀO CHƯƠNG 7 — TOKEN BLACKLIST

## 7.5.5. Token Blacklist — Vô hiệu hóa Token tức thì (bổ sung)

### Vấn đề

JWT là stateless — server không lưu session. Một token hợp lệ sẽ tiếp tục hoạt động cho đến khi hết hạn, dù user đã logout. Kịch bản nguy hiểm có thể xảy ra khi user đăng nhập trên máy công cộng, logout lúc 9:00, nhưng kẻ tấn công đã capture được token trước đó. Nếu sử dụng token đó lúc 9:05, request vẫn thành công vì token chưa hết hạn tự nhiên.

### Giải pháp: InvalidatedToken Table

Mỗi khi user logout, lưu token vào bảng `InvalidatedToken`. `JwtStrategy` kiểm tra blacklist trước mỗi request. Schema Prisma cho bảng này bao gồm các field: `token` (giá trị token duy nhất), `expiresAt` (thời điểm hết hạn), và `reason` (lý do vô hiệu hóa: LOGOUT, BANNED, hoặc PASSWORD_CHANGED).

Trong `AuthService.logout()`, quá trình xử lý diễn ra hai bước. Đầu tiên, tất cả refresh tokens của user được revoke. Sau đó, access token hiện tại được thêm vào blacklist:

```typescript
async logout(userId: string, accessToken: string) {
  await this.prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  if (accessToken) {
    const decoded = this.jwtService.decode(accessToken);
    await this.prisma.invalidatedToken.create({
      data: {
        token: accessToken,
        expiresAt: new Date(decoded.exp * 1000),
        reason: 'LOGOUT',
      },
    });
  }

  return { message: 'Logout successfully' };
}
```

Tại `JwtStrategy.validate()`, mỗi request authenticated đều được kiểm tra qua blacklist:

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

### Trade-off và tối ưu

Cơ chế này tốn thêm một query database cho mỗi request authenticated. Đối với hệ thống có lượng traffic cao, có thể thay thế PostgreSQL bằng Redis để lưu blacklist trong bộ nhớ, giảm đáng kể thời gian truy vấn. Ngoài ra, nên có cron job định kỳ dọn dẹp các record đã hết hạn để tránh bảng phình to theo thời gian.
