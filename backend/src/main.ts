import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ───────────────────────────────────────────────
  // 1. GLOBAL PREFIX
  // ───────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ───────────────────────────────────────────────
  // 2. GLOBAL PIPES
  // ───────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ───────────────────────────────────────────────
  // 3. GLOBAL INTERCEPTORS
  // ───────────────────────────────────────────────
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformResponseInterceptor(),
  );

  // ───────────────────────────────────────────────
  // 4. GLOBAL FILTERS
  // ───────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ───────────────────────────────────────────────
  // 5. SWAGGER
  // ───────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('TodoList Collaboration API')
    .setDescription('API documentation cho dự án TodoList Collaboration')
    .setVersion('1.0')
    .addBearerAuth() // Thêm nút "Authorize" trên Swagger UI để nhập JWT token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

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
