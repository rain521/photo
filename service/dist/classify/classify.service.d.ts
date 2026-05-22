import { Repository } from 'typeorm';
import { Classify } from '../entities/classify.entity';
import { CreateClassifyDto } from './dto/classify.dto';
export declare class ClassifyService {
    private classifyRepository;
    constructor(classifyRepository: Repository<Classify>);
    create(data: Partial<Classify>): Promise<Classify>;
    findAll(type: string): Promise<Classify[]>;
    findOne(id: number): Promise<Classify | null>;
    update(id: number, dto: CreateClassifyDto): Promise<Classify | null>;
    remove(id: number): Promise<void>;
    findAndCount(query: any): Promise<[Classify[], number]>;
}
