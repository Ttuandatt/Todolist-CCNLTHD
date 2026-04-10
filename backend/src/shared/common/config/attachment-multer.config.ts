import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const attachmentDir = join(process.cwd(), 'uploads', 'attachments');

// Ensure directory exists
if (!existsSync(attachmentDir)) {
  mkdirSync(attachmentDir, { recursive: true });
}

export const attachmentMulterConfig = {
  storage: diskStorage({
    destination: attachmentDir,
    filename: (_req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      callback(null, `attachment-${uniqueSuffix}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
};
