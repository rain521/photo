import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classify } from '../entities/classify.entity';
import { CreateClassifyDto } from './dto/classify.dto';

@Injectable()
export class ClassifyService {
	constructor(
		@InjectRepository(Classify)
		private classifyRepository: Repository<Classify>,
	) { }

	async create(data: Partial<Classify>) {
		const item = this.classifyRepository.create(data);
		return await this.classifyRepository.save(item);
	}

	findAll(type: string): Promise<Classify[]> {
        const query: any = { order: { seq: 'ASC' }, where: {  } };
        if (type) {
            query.where.type = type;
        }
		return this.classifyRepository.find(query);
	}

	async findOne(id: number): Promise<Classify | null> {
		const item = await this.classifyRepository.findOne({ where: { id } });
		return item;
	}

	async update(id: number, dto: CreateClassifyDto) {
		const data = await this.classifyRepository.findOne({ where: { id } });
		if (!data) {
			throw new NotFoundException(`分类(ID: ${id})不存在`);
		}
		try {
			const updated = this.classifyRepository.merge(data, dto);
			await this.classifyRepository.save(updated);
			return await this.findOne(id);
		} catch (err) {
			throw new BadRequestException('更新分类失败');
		}
	}

	async remove(id: number): Promise<void> {
		// 删除分类前不级联删除照片，数据库外键应阻止删除（若有关联）
		await this.classifyRepository.delete(id);
	}

	async findAndCount(query: any): Promise<[Classify[], number]> {
		const [data, total] = await this.classifyRepository.findAndCount(query);
		return [data, total];
	}
}
