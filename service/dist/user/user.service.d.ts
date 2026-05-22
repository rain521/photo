import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private userRepository;
    private configService;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    create(userData: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findOneName(name: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User | null>;
    remove(id: number): Promise<void>;
    findAndCount(query: any): Promise<[User[], number]>;
    getSessionByCode(code: string): Promise<{
        openid: any;
        session_key: any;
        unionid: any;
    }>;
    findOrCreateByOpenid(openid: string): Promise<User>;
}
