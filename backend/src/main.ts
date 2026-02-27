import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .addBearerAuth()   // Thêm nút "Authorize" trên Swagger UI để nhập JWT token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
