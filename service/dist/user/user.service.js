"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let UserService = class UserService {
    userRepository;
    configService;
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
    }
    async create(userData) {
        if (userData.userName) {
            const exist = await this.userRepository.findOne({ where: { userName: userData.userName } });
            if (exist) {
                throw new common_1.BadRequestException('用户名已存在');
            }
        }
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }
    findAll() {
        return this.userRepository.find({ relations: ["photos"] });
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id: id },
            relations: ['photos'],
        });
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async findOneName(name) {
        const user = await this.userRepository.findOne({
            where: { userName: name },
        });
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`用户(ID: ${id})不存在`);
        }
        try {
            if (updateUserDto.userName && updateUserDto.userName !== user.userName) {
                const conflict = await this.userRepository.findOne({ where: { userName: updateUserDto.userName } });
                if (conflict && conflict.id !== id) {
                    throw new common_1.BadRequestException('用户名已存在');
                }
            }
            const updatedUser = this.userRepository.merge(user, updateUserDto);
            await this.userRepository.save(updatedUser);
            return await this.findOne(id);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.BadRequestException('更新用户失败，请稍后重试');
        }
    }
    async remove(id) {
        await this.userRepository.delete(id);
    }
    async findAndCount(query) {
        const [data, total] = await this.userRepository.findAndCount(query);
        return [data, total];
    }
    async getSessionByCode(code) {
        const appid = this.configService.get('WX_APPID');
        const secret = this.configService.get('WX_SECRET');
        const url = 'https://api.weixin.qq.com/sns/jscode2session';
        const { data } = await axios_1.default.get(url, {
            params: {
                appid,
                secret,
                js_code: code,
                grant_type: 'authorization_code',
            },
        });
        if (data.errcode) {
            throw new common_1.HttpException(`微信登录失败: ${data.errmsg}`, common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            openid: data.openid,
            session_key: data.session_key,
            unionid: data.unionid,
        };
    }
    async findOrCreateByOpenid(openid) {
        let user = await this.userRepository.findOne({ where: { openid } });
        if (!user) {
            user = this.userRepository.create({ openid, lastName: '微信用户' });
            await this.userRepository.save(user);
        }
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map