import { Injectable } from '@nestjs/common';
import { Wifi } from '../entities/wifi.entity';
import { Wifi as WifiInterface } from '../interface/wifi';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WifiService {
    constructor(
        @InjectRepository(Wifi)
        private wifiRepository: Repository<Wifi>,
    ) { }
    async create(createWifiDto: Partial<Wifi>) {
        const data = this.wifiRepository.create(createWifiDto);
        return await this.wifiRepository.save(data);
    }

    async findAll(userId: number) {
        const data = await this.wifiRepository.find({ where: { userId } });
        return data;
    }

    async findOne(id: number): Promise<Wifi | null> {
        return this.wifiRepository.findOne({ where: { id } });
    }

    async update(id: number, updateWifiDto: Partial<Wifi>) {
        await this.wifiRepository.update(id, updateWifiDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        return this.wifiRepository.delete(id);
    }
}
