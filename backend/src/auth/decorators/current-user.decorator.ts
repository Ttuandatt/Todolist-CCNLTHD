// createParamDecorator — tạo decorator cho THAM SỐ method (giống @Body(), @Param())
// Khác với SetMetadata (gắn metadata), createParamDecorator TRẢ VỀ GIÁ TRỊ cho tham số
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // data = giá trị truyền vào decorator, ví dụ @CurrentUser('email') thì data = 'email'
  // ctx = ExecutionContext, dùng để lấy request object
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // request.user được gắn bởi JwtStrategy.validate() ở Bước 3. VD: user = { id: 'uuid', email: 'john@example.com' }

    // Nếu truyền tên field cụ thể → trả field đó
    // Nếu không → trả toàn bộ user object
    return data ? user[data] : user;

    // Ví dụ:
    // @CurrentUser() user        → user = { id: '...', email: '...' }
    // @CurrentUser('id') userId  → userId = '...'
    // @CurrentUser('email') email → email = '...'
  },
);
