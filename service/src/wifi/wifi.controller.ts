import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WifiService } from './wifi.service';
import { Wifi } from '../interface/wifi';

@Controller('wifi')
export class WifiController {
  constructor(private readonly wifiService: WifiService) {}

  @Post()
  create(@Body() createWifiDto: Wifi) {
    return this.wifiService.create(createWifiDto);
  }

  @Get()
  findAll() {
    return this.wifiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wifiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWifiDto: Wifi) {
    return this.wifiService.update(+id, updateWifiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wifiService.remove(+id);
  }
}
