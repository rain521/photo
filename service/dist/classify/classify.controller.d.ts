import { ClassifyService } from './classify.service';
import { CreateClassifyDto } from './dto/classify.dto';
export declare class ClassifyController {
    private readonly classifyService;
    constructor(classifyService: ClassifyService);
    create(dto: CreateClassifyDto): Promise<import("../entities/classify.entity").Classify>;
    findAll(type: string): Promise<import("../entities/classify.entity").Classify[]>;
    findOne(id: string): Promise<import("../entities/classify.entity").Classify | null>;
    update(id: string, dto: CreateClassifyDto): Promise<import("../entities/classify.entity").Classify | null>;
    remove(id: string): Promise<void>;
    pagination(body: any): Promise<{
        data: import("../entities/classify.entity").Classify[];
        total: number;
        page: any;
        size: any;
    }>;
}
