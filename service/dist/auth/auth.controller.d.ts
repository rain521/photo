import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): Promise<import("../entities/user.entity").User | null>;
    loginWx(code: string): Promise<{
        access_token: string;
    }>;
}
