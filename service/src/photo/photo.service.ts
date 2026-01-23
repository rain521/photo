import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Photo } from '../entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm';
import { PhotoDto } from './dto/photo.dto';
import { OssService } from '../oss/oss.service';
import { Classify } from '../entities/classify.entity';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo)
        private photoRepository: Repository<Photo>,
        @InjectRepository(Classify)
        private classifyRepository: Repository<Classify>,
        private readonly ossService: OssService,
    ) { }

    async create(data: Partial<Photo>, userId: number) {
        data.userId = userId;
        // 验证 classifyId 是否存在，防止外键约束失败
        if (data.classifyId !== undefined && data.classifyId !== null) {
            const cls = await this.classifyRepository.findOne({ where: { id: data.classifyId } });
            if (!cls) {
                throw new BadRequestException('分类不存在');
            }
        }
        const item = this.photoRepository.create(data);
        return await this.photoRepository.save(item);
    }

    async bulkCreate(items: Partial<Photo>[], userId: number) {
        if (!Array.isArray(items) || items.length === 0) return [];
        // 验证 classifyId 的存在性（一次性查询提升性能）
        const classifyIds = Array.from(new Set(items.map(i => i.classifyId).filter(id => id !== undefined && id !== null)));
        if (classifyIds.length) {
            const exists = await this.classifyRepository.find({ where: { id: In(classifyIds) } });
            const existsSet = new Set(exists.map(c => c.id));
            const missing = classifyIds.filter(id => !existsSet.has(id));
            if (missing.length) {
                throw new BadRequestException(`分类不存在: ${missing.join(',')}`);
            }
        }

        const toSave = items.map(i => ({ ...i, userId }));
        const created = this.photoRepository.create(toSave as any[]);
        const saved = await this.photoRepository.save(created);

        // 构建 classifyName 映射
        const clsMap = new Map<number, string>();
        if (classifyIds.length) {
            const cls = await this.classifyRepository.find({ where: { id: In(classifyIds) } });
            cls.forEach(c => clsMap.set(c.id, (c as any).name));
        }

        const mapped = saved.map(s => ({
            ...s,
            classifyName: s.classifyId ? clsMap.get(s.classifyId) ?? null : null,
        }));
        return mapped as (Photo & { classifyName?: string })[];
    }

    async findAndCount(query: any): Promise<[Photo[], number]> {
        const [data, total] = await this.photoRepository.findAndCount(query);
        const dataList = data.map(item => {
            const { classify,...anyP } = item;
            return {
               ...anyP,
                classifyName: classify?.name ?? null,
            } as Photo & { classifyName?: string };
        })
        return [dataList, total];
    }

    async findOne(id: number): Promise<Photo | null> {
        const photo = await this.photoRepository.findOne({ where: { id: id }, relations: ['classify'] });
        if (!photo) return null;
        const { classify,...anyP } = photo;
        return {
            ...anyP,
            classifyName: classify?.name ?? null,
        } as Photo & { classifyName?: string };
    }

    async update(photoDto: PhotoDto & { id: number }) {
        // 检查用户是否存在
        const id = photoDto.id;
        const data = await this.photoRepository.findOne({ where: { id } });
        if (!data) {
            throw new NotFoundException(`图片不存在`);
        }
        try {
            const maybeClassifyId = (photoDto as any).classifyId;
            if (maybeClassifyId !== undefined && maybeClassifyId !== null) {
                const cls = await this.classifyRepository.findOne({ where: { id: maybeClassifyId } });
                if (!cls) {
                    throw new BadRequestException('分类不存在');
                }
            }
            const updatedUser = this.photoRepository.merge(data, photoDto);
            await this.photoRepository.save(updatedUser);
            return await this.findOne(id); // 重新获取以返回完整信息
        } catch (error) {
            throw new BadRequestException('更新图片失败，请稍后重试');
        }
    }

    async remove(id: number): Promise<void> {
        // 先查出记录以获取 OSS url
        const data = await this.photoRepository.findOne({ where: { id } });
        if (!data) {
            throw new NotFoundException('图片不存在');
        }

        // 删除数据库记录
        await this.photoRepository.delete(id);

        // 从 url 中提取对象 key 并尝试删除 OSS 上的文件（忽略错误，记录或抛出可按需调整）
        try {
            const url = data.url || '';
            // 使用 URL 解析以提取 pathname
            let objectKey = '';
            try {
                const u = new URL(url);
                objectKey = u.pathname.replace(/^\//, '');
            } catch (e) {
                // 如果 url 不是完整 URL，尝试直接使用原值
                objectKey = url.replace(/^\//, '');
            }

            if (objectKey) {
                await this.ossService.deleteObject(objectKey);
            }
        } catch (err) {
            // 这里不阻塞删除流程，但可以考虑记录日志或重新抛出
            // console.warn('删除 OSS 对象失败', err);
        }
    }
}
