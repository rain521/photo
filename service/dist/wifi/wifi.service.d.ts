import { Wifi } from '../entities/wifi.entity';
import { Repository } from 'typeorm';
export declare class WifiService {
    private wifiRepository;
    constructor(wifiRepository: Repository<Wifi>);
    create(createWifiDto: Partial<Wifi>): Promise<Wifi>;
    findAll(userId: number): Promise<Wifi[]>;
    findOne(id: number): Promise<Wifi | null>;
    update(id: number, updateWifiDto: Partial<Wifi>): Promise<Wifi | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
