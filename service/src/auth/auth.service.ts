import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) { }
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOneName(username);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user: any) {
        const payload = { username: user.userName, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async loginByWechat(code: string): Promise<string> {
        // 1. 换取 openid 和 session_key
        const { openid, session_key } = await this.userService.getSessionByCode(code);

        // 2. 查找或创建用户
        const user = await this.userService.findOrCreateByOpenid(openid);

        // 3. 生成 JWT (payload 保存用户 id，不要存敏感信息)
        const payload = { username: user.lastName, sub: user.id };
        return this.jwtService.sign(payload);
    }
}
