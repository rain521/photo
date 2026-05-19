import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException, InternalServerErrorException, ParseUUIDPipe } from '@nestjs/common';
import { WifiService } from './wifi.service';
import { Wifi } from '../interface/wifi';
import { Public } from 'src/utils/public';

@Controller('wifi')
export class WifiController {
    constructor(private readonly wifiService: WifiService) { }

    @Post()
    create(@Body() createWifiDto: Wifi) {
        if(!createWifiDto.userId || !createWifiDto.name || !createWifiDto.password){
            throw new InternalServerErrorException ('数据不准确，请检查');
        }
        return this.wifiService.create(createWifiDto);
    }

    @Get('getAll')
    findAll(@Request() req) {
        return this.wifiService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: number) {
        return this.wifiService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: number) {
        return this.wifiService.remove(id);
    }
}
