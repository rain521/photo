import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // 设置全局前缀为 'api'
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    // 获取底层的 Express 实例
    const expressApp = app.getHttpAdapter().getInstance();
    
    expressApp.use(express.json({ limit: '100mb' }));
    expressApp.use(express.urlencoded({ limit: '100mb', extended: true }));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
