import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpStatus, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import * as express from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

// 全局请求日志拦截器
class RequestLoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, originalUrl, ip } = request;
        const userAgent = request.headers['user-agent'] || '';
        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: () => {
                    const response = context.switchToHttp().getResponse();
                    const statusCode = response.statusCode;
                    const duration = Date.now() - startTime;
                    const msg = `${method} ${originalUrl} ${statusCode} ${duration}ms`;

                    if (statusCode >= 400) {
                        this.logger.warn(msg);
                    } else {
                        this.logger.log(msg);
                    }
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    const statusCode = error?.status || error?.statusCode || 500;
                    this.logger.error(
                        `${method} ${originalUrl} ${statusCode} ${duration}ms - ${error.message}`,
                        error.stack,
                    );
                },
            }),
        );
    }
}

async function bootstrap() {
    // 使用 Winston 作为全局 Logger
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(winstonConfig),
    });

    // 设置全局前缀为 'api'
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
        new PostSuccessStatusInterceptor(),
        new RequestLoggingInterceptor(),
    );

    // 启用CORS
    app.enableCors();

    // 获取底层的 Express 实例
    const expressApp = app.getHttpAdapter().getInstance();

    expressApp.use(express.json({ limit: '100mb' }));
    expressApp.use(express.urlencoded({ limit: '100mb', extended: true }));

    await app.listen(process.env.PORT ?? 3000);
    Logger.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
