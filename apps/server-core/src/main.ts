import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 开启跨域（前后端分离必备）
  app.enableCors();

  // 全局路由前缀，后续 API 都会变成 /api/xxx
  app.setGlobalPrefix('api');

  // 开启全局参数校验（配合 class-validator 使用）
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剔除 DTO 中未定义的属性
      transform: true, // 自动转换类型
    }),
  );

  await app.listen(3000);
  console.log(`🚀 Server is running on: http://localhost:3000/api`);
}
bootstrap();
