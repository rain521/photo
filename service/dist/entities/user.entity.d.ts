import { Photo } from './photo.entity';
import { Wifi } from './wifi.entity';
export declare class User {
    id: number;
    userName?: string;
    password?: string;
    lastName?: string;
    openid?: string;
    isActive: boolean;
    photos?: Photo[];
    wifis?: Wifi[];
    createdAt: Date;
    updatedAt: Date;
}
