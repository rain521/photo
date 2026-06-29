import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

// 日志文件目录
const LOG_DIR = 'logs';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 控制台输出格式
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('PhotoService', {
        colors: true,
        prettyPrint: true,
        processId: true,
    }),
);

// 文件输出格式（纯文本，不带颜色）
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, context, trace, ms, ...meta }) => {
        const ctx = context ? `[${context}]` : '';
        const msStr = ms ? ` ${ms}` : '';
        const traceStr = trace ? `\n${trace}` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level.toUpperCase()} ${ctx} ${message}${msStr}${traceStr}${metaStr}`;
    }),
);

// 按天滚动的文件传输
const dailyRotateFile = new winston.transports.DailyRotateFile({
    dirname: LOG_DIR,
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',   // 保留 30 天
    maxSize: '20m',    // 单文件最大 20MB
    format: fileFormat,
});

const dailyRotateErrorFile = new winston.transports.DailyRotateFile({
    dirname: LOG_DIR,
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxFiles: '30d',
    maxSize: '20m',
    format: fileFormat,
});

export const winstonConfig: WinstonModuleOptions = {
    level: IS_PRODUCTION ? 'info' : 'debug',
    transports: [
        // 控制台输出
        new winston.transports.Console({
            format: consoleFormat,
        }),
        // 所有日志写入文件
        dailyRotateFile,
        // 错误日志单独写入文件
        dailyRotateErrorFile,
    ],
    // 不记录异常，让 NestJS 的默认异常过滤器处理
    exitOnError: false,
};
