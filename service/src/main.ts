import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpStatus, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import * as express from 'express';
import { Observable } from 'rxjs';

class PostSuccessStatusInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (request.method === 'POST') {
            response.status(HttpStatus.OK);
        }
        return next.handle();
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // 设置全局前缀为 'api'
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new PostSuccessStatusInterceptor());

    // 启用CORS
    app.enableCors();

    // 获取底层的 Express 实例
    const expressApp = app.getHttpAdapter().getInstance();
    
    expressApp.use(express.json({ limit: '100mb' }));
    expressApp.use(express.urlencoded({ limit: '100mb', extended: true }));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
