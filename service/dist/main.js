"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
const winston_config_1 = require("./config/winston.config");
const express = require("express");
const operators_1 = require("rxjs/operators");
class PostSuccessStatusInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        if (request.method === 'POST') {
            response.status(common_1.HttpStatus.OK);
        }
        return next.handle();
    }
}
class RequestLoggingInterceptor {
    logger = new common_1.Logger('HTTP');
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, originalUrl, ip } = request;
        const userAgent = request.headers['user-agent'] || '';
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode;
                const duration = Date.now() - startTime;
                const msg = `${method} ${originalUrl} ${statusCode} ${duration}ms`;
                if (statusCode >= 400) {
                    this.logger.warn(msg);
                }
                else {
                    this.logger.log(msg);
                }
            },
            error: (error) => {
                const duration = Date.now() - startTime;
                const statusCode = error?.status || error?.statusCode || 500;
                this.logger.error(`${method} ${originalUrl} ${statusCode} ${duration}ms - ${error.message}`, error.stack);
            },
        }));
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger(winston_config_1.winstonConfig),
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new PostSuccessStatusInterceptor(), new RequestLoggingInterceptor());
    app.enableCors();
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use(express.json({ limit: '100mb' }));
    expressApp.use(express.urlencoded({ limit: '100mb', extended: true }));
    await app.listen(process.env.PORT ?? 3000);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map