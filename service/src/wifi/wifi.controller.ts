import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Request,
    Query,
    InternalServerErrorException,
    ParseUUIDPipe,
    Put,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { WifiService } from './wifi.service';
import { Wifi } from '../interface/wifi';
import { Public } from 'src/utils/public';

@Controller('wifi')
export class WifiController {
    constructor(private readonly wifiService: WifiService) {}

    @Post()
    create(@Body() createWifiDto: Wifi) {
        if (
            !createWifiDto.userId ||
            !createWifiDto.name ||
            !createWifiDto.password
        ) {
            throw new InternalServerErrorException('数据不准确，请检查');
        }
        return this.wifiService.create(createWifiDto);
    }

    @Public()
    @Get('qrcode')
    async getQrcode(
        @Query('page') page: string,
        @Query('scene') scene: string,
        @Res() res: Response,
    ) {
        console.log(page, scene); // 获取参数
        const buffer = await this.wifiService.createWxaQrcode(page, scene);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
    }

    @Get('getAll')
    findAll(@Request() req: { user: { userId: number } }) {
        return this.wifiService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.wifiService.findOne(id);
    }

    @Get()
    findOneByQuery(@Query('id') id: number) {
        return this.wifiService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: number) {
        return this.wifiService.remove(id);
    }

    @Put()
    update(@Body() createWifiDto: Wifi) {
        return this.wifiService.update(createWifiDto.id, createWifiDto);
    }
}
