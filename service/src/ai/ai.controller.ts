import { Body, Controller, Post, Sse, MessageEvent } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Public } from 'src/utils/public';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('ai')
export class AiController {
    constructor(private albumService: AlbumService) { }

    /**
     * 单模板智能排版
     */
    @Public()
    @Post('match')
    async matchTemplate(
        @Body() body: {
            templateImage: string;           // 模板图 URL
            userImages: string[];            // 用户图片 URL 数组
        },
    ) {
        const order = await this.albumService.matchSingleTemplate(
            body.templateImage,
            body.userImages,
        );
        return {
            success: true,
            order,
        };
    }

    /**
     * 多模板智能排版（自动选择最佳模板）
     */
    @Public()
    @Post('match-multi')
    async matchMultiTemplates(
        @Body() body: {
            templates: string[];             // 模板图 URL 数组
            userImages: string[];            // 用户图片 URL 数组
        },
    ) {
        const { orderUrls, ...result } = await this.albumService.matchMultipleTemplates(
            body.templates,
            body.userImages,
        );
        return {
            orderUrls,
            ...result,
        };
    }

    @Public()
    @Sse('events')
    sendEvents(): Observable<MessageEvent> {
        return interval(1000).pipe(
            map((count) => ({
                data:`第 ${count + 1} 次推送`,
            })),
        );
    }
}
