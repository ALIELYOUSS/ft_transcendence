import { join } from 'path';
import { static as serveStatic } from 'express';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Uploaded images, saved on disk by UploadsService (reached as /api/uploads/... via nginx).
  app.use('/uploads/posts', serveStatic(join(process.cwd(), 'uploads', 'posts')));
  app.use('/uploads/avatars', serveStatic(join(process.cwd(), 'uploads', 'avatars')));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('wemeet API')
    .setDescription('API documentation for the wemeet platform')
    .setVersion('0.1')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
