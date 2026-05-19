import { Controller, Get, Post, Body, Request, Param, Delete, Query, UnauthorizedException, NotFoundException, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/utils/public';
import { Like } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
        return this.userService.findAll();
    }


    @Get('name')
    getUserNames(@Query('name') name: string) {
        if (!name) {
            throw new NotFoundException(`用户不能为空`);
        }
        return this.userService.findOneName(name);
    }

    @UseGuards(JwtAuthGuard)
    @Get('getUser')
    getUser(@Request() req) {
        if (!req.user || !req.user.userId) {
            throw new UnauthorizedException('请先登录');
        }
        return this.userService.findOne(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
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
