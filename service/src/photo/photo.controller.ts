import { Body, Controller, Post, UseGuards, Request, Get, Param, Put, Delete } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoDto } from './dto/photo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Like } from 'typeorm';

@Controller('photo')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() photoDto: PhotoDto, @Request() req) {
        return this.photoService.create(photoDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('batch')
    batchCreate(@Body() items: PhotoDto[], @Request() req) {
        return this.photoService.bulkCreate(items as any[], req.user.userId);
    }


    @Post('pagination')
    async pagination(@Body() body, @Request() req) {
        const { page, size, type, classifyId } = body;
        const query: any = {
            skip: page * size,
            take: size,
            order: { createdAt: 'DESC' },
            where: { },
            relations: ['classify']
        };
        if (type) {
            query.where.type = type;
        }
        if (classifyId) {
            query.where.classifyId = classifyId;
        }
        const [data, total] = await this.photoService.findAndCount(query);
        return {
            data: data,
            total,
            page,
            size
        };
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.photoService.findOne(+id);
    }

    @Put()
    update(@Body() photoDto: PhotoDto & {id: number}) {
        return this.photoService.update(photoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.photoService.remove(+id);
    }
}
