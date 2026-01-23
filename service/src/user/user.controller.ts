import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UnauthorizedException, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/utils/public';
import { Like } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Public()
    @Get()
    findAll() {
        console.log('user.controller.ts:findAll')
        return this.userService.findAll();
    }


    @Get('name')
    getUserNames(@Query('name') name: string) {
        if (!name) {
            throw new NotFoundException(`用户不能为空`);
        }
        return this.userService.findOneName(name);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    @Post('pagination')
    async pagination(@Body() body) {
        const { page, size, name } = body;
        const query: any = {
            skip: page * size,
            take: size,
            order: { createdAt: 'DESC' },
            where:{}
        };
        if (name) {
            query.where.lastName = Like(`%${name}%`);
        }
        const [data, total] = await this.userService.findAndCount(query);
        return {
            data: data,
            total,
            page,
            size
        };
    }
}
