import { Response } from 'express';
import { WifiService } from './wifi.service';
import { Wifi } from '../interface/wifi';
export declare class WifiController {
    private readonly wifiService;
    constructor(wifiService: WifiService);
    create(createWifiDto: Wifi): Promise<import("../entities/wifi.entity").Wifi>;
    getQrcode(page: string, scene: string, res: Response): Promise<void>;
    findAll(req: {
        user: {
            userId: number;
        };
    }): Promise<import("../entities/wifi.entity").Wifi[]>;
    findOne(id: number): Promise<import("../entities/wifi.entity").Wifi | null>;
    findOneByQuery(id: number): Promise<import("../entities/wifi.entity").Wifi | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    update(createWifiDto: Wifi): Promise<import("../entities/wifi.entity").Wifi | null>;
}
