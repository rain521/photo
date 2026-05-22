import { User } from './user.entity';
export declare class Wifi {
    id: number | undefined;
    name: string;
    password: string;
    userId: number;
    user: User;
    createdAt: Date;
    isActive: boolean;
}
