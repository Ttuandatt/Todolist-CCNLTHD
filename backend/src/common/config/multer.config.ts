import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const avatarDir = join(process.cwd(), 'uploads', 'avatars');

// Ensure the directory exists (sync vì chạy 1 lần khi app khởi tạo)
if (!existsSync(avatarDir)) {
  mkdirSync(avatarDir, { recursive: true });
}

// ─── Cấu hình Multer ─────────────────────────────────────────────────────────
export const avatarMulterConfig = {
  // Cấu hình Multer cho việc upload ảnh đại diện
  storage: diskStorage({
    // Cấu hình lưu trữ
    destination: avatarDir, // Lưu trữ vào thư mục uploads/avatars
    filename: (_req, file, callback) => {
      // Tạo tên file duy nhất
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // Tạo phần đuôi tên file duy nhất
      callback(
        null,
        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
      ); // Đặt tên file theo định dạng: fieldname-timestamp-random.ext
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file (5MB)
  fileFilter: (_req, file, callback) => {
    // Lọc file theo định dạng
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      // Nếu định dạng file không hợp lệ
      return callback(
        new Error('Only image/jpeg, image/png, image/gif files are allowed!'),
        false,
      ); // Trả về lỗi
    }
    callback(null, true); // Cho phép upload file
  },
};
