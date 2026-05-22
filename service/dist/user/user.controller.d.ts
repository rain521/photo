import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("../entities/user.entity").User>;
    findAll(): Promise<import("../entities/user.entity").User[]>;
    getUserNames(name: string): Promise<import("../entities/user.entity").User | null>;
    getUser(req: any): Promise<import("../entities/user.entity").User | null>;
    findOne(id: number): Promise<import("../entities/user.entity").User | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("../entities/user.entity").User | null>;
    remove(id: number): Promise<void>;
    pagination(body: any): Promise<{
        data: import("../entities/user.entity").User[];
        total: number;
        page: any;
        size: any;
    }>;
}
