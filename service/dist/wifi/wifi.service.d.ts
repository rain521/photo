import { Wifi } from '../entities/wifi.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export declare class WifiService {
    private wifiRepository;
    private configService;
    constructor(wifiRepository: Repository<Wifi>, configService: ConfigService);
    create(createWifiDto: Partial<Wifi>): Promise<Wifi>;
    findAll(userId: number): Promise<Wifi[]>;
    findOne(id: number): Promise<Wifi | null>;
    update(id: number, updateWifiDto: Partial<Wifi>): Promise<Wifi | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    createWxaQrcode(page: string, scene: string): Promise<Buffer>;
    getAccessToken(): Promise<string>;
}
