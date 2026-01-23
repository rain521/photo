import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { ClassifyService } from './classify.service';
import { CreateClassifyDto } from './dto/classify.dto';
import { Like } from 'typeorm';

@Controller('classify')
export class ClassifyController {
	constructor(private readonly classifyService: ClassifyService) { }

	@Post()
	create(@Body() dto: CreateClassifyDto) {
		return this.classifyService.create(dto as any);
	}

	@Get('findAll')
	findAll(@Query('type') type: string) {
		return this.classifyService.findAll(type);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.classifyService.findOne(+id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() dto: CreateClassifyDto) {
		return this.classifyService.update(+id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.classifyService.remove(+id);
	}

    
    @Post('pagination')
    async pagination(@Body() body) {
        const { page, size, type, name } = body;
        const query: any = {
            skip: page * size,
            take: size,
            order: { createdAt: 'DESC' },
            where: { }
        };
        if (type) {
            query.where.type = type;
        }
        if (name) {
            query.where.name = Like(`%${name}%`);
        }
        const [data, total] = await this.classifyService.findAndCount(query);
        return {
            data: data,
            total,
            page,
            size
        };
    }
}
