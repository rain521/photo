import { MessageEvent } from '@nestjs/common';
import { AlbumService } from './album.service';
import { Observable } from 'rxjs';
export declare class AiController {
    private albumService;
    constructor(albumService: AlbumService);
    matchTemplate(body: {
        templateImage: string;
        userImages: string[];
    }): Promise<{
        success: boolean;
        order: number[];
    }>;
    matchMultiTemplates(body: {
        templates: string[];
        userImages: string[];
    }): Promise<any>;
    sendEvents(): Observable<MessageEvent>;
}
