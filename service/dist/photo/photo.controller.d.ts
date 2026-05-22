import { PhotoService } from './photo.service';
import { PhotoDto } from './dto/photo.dto';
export declare class PhotoController {
    private readonly photoService;
    constructor(photoService: PhotoService);
    create(photoDto: PhotoDto, req: any): Promise<import("../entities/photo.entity").Photo>;
    batchCreate(items: PhotoDto[], req: any): Promise<(import("../entities/photo.entity").Photo & {
        classifyName?: string;
    })[]>;
    pagination(body: any, req: any): Promise<{
        data: import("../entities/photo.entity").Photo[];
        total: number;
        page: any;
        size: any;
    }>;
    findOne(id: string): Promise<import("../entities/photo.entity").Photo | null>;
    update(photoDto: PhotoDto & {
        id: number;
    }): Promise<import("../entities/photo.entity").Photo | null>;
    remove(id: string): Promise<void>;
}
