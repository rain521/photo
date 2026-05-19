import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WifiService } from './wifi.service';
import { WifiController } from './wifi.controller';
import { Wifi } from '../entities/wifi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wifi])],
  controllers: [WifiController],
  providers: [WifiService],
})
export class WifiModule {}
