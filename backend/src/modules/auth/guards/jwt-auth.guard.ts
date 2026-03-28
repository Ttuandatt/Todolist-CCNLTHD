import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core'; // Reflector — dùng để ĐỌC metadata từ decorators. Ở đây ta đọc metadata 'isPublic' để biết route có cần auth không

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // Override method canActivate để thêm logic @Public()
  canActivate(context: ExecutionContext) {
    // reflector.getAllAndOverride đọc metadata 'isPublic' từ:
    //   1. Method handler (ưu tiên) — decorator trên từng route
    //   2. Class (controller) — decorator trên cả controller
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu route được đánh dấu @Public() → bỏ qua JWT check, cho qua luôn
    if (isPublic) {
      return true;
    }

    // Nếu không phải public → chạy logic JWT verify mặc định
    // AuthGuard('jwt') sẽ gọi JwtStrategy.validate()
    return super.canActivate(context);
  }
}
