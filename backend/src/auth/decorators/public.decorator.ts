// SetMetadata — gắn metadata lên route handler
// Metadata này sẽ được đọc bởi JwtAuthGuard qua Reflector
import { SetMetadata } from "@nestjs/common";

// Hằng số key — dùng chung giữa decorator và guard để "nói cùng ngôn ngữ"
export const IS_PUBLIC_KEY = 'isPublic';

// Hàm Public() trả về một decorator
// SetMetadata(key, value) gắn metadata 'isPublic' = true vào route handler
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);