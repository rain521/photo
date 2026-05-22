import { Photo } from '../entities/photo.entity';
import { Repository } from 'typeorm';
import { PhotoDto } from './dto/photo.dto';
import { OssService } from '../oss/oss.service';
import { Classify } from '../entities/classify.entity';
export declare class PhotoService {
    private photoRepository;
    private classifyRepository;
    private readonly ossService;
    constructor(photoRepository: Repository<Photo>, classifyRepository: Repository<Classify>, ossService: OssService);
    create(data: Partial<Photo>, userId: number): Promise<Photo>;
    bulkCreate(items: Partial<Photo>[], userId: number): Promise<(Photo & {
        classifyName?: string;
    })[]>;
    findAndCount(query: any): Promise<[Photo[], number]>;
    findOne(id: number): Promise<Photo | null>;
    update(photoDto: PhotoDto & {
        id: number;
    }): Promise<Photo | null>;
    remove(id: number): Promise<void>;
}
