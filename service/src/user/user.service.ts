import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private configService: ConfigService,
    ) { }

    async create(userData: Partial<User>) {
        // 用户名唯一性校验
        if (userData.userName) {
            const exist = await this.userRepository.findOne({ where: { userName: userData.userName } });
            if (exist) {
                throw new BadRequestException('用户名已存在');
            }
        }
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find({ relations: ["photos"] });
    }

    async findOne(id: number): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { id: id },
            relations: ['photos'], // 加载关联的 photos
        });
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async findOneName(name: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { userName: name },
        });
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        // 检查用户是否存在
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`用户(ID: ${id})不存在`);
        }
        try {
            // 若更新包含 userName，检查唯一性（排除当前用户）
            if (updateUserDto.userName && updateUserDto.userName !== user.userName) {
                const conflict = await this.userRepository.findOne({ where: { userName: updateUserDto.userName } });
                if (conflict && conflict.id !== id) {
                    throw new BadRequestException('用户名已存在');
                }
            }
            const updatedUser = this.userRepository.merge(user, updateUserDto);
            await this.userRepository.save(updatedUser);
            return await this.findOne(id); // 重新获取以返回完整信息
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new BadRequestException('更新用户失败，请稍后重试');
        }
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async findAndCount(query: any): Promise<[User[], number]> {
        const [data, total] = await this.userRepository.findAndCount(query);
        return [data, total];
    }


    async getSessionByCode(code: string) {
        const appid = this.configService.get<string>('WX_APPID');
        const secret = this.configService.get<string>('WX_SECRET');

        const url = 'https://api.weixin.qq.com/sns/jscode2session';
        const { data } = await axios.get(url, {
            params: {
                appid,
                secret,
                js_code: code,
                grant_type: 'authorization_code',
            },
        });

        if (data.errcode) {
            throw new HttpException(
                `微信登录失败: ${data.errmsg}`,
                HttpStatus.BAD_REQUEST,
            );
        }

        return {
            openid: data.openid,
            session_key: data.session_key,
            unionid: data.unionid, // 只有在满足条件时返回
        };
    }

    async findOrCreateByOpenid(openid: string): Promise<User> {
        let user = await this.userRepository.findOne({ where: { openid } });
        if (!user) {
            user = this.userRepository.create({ openid,lastName: '微信用户' });
            await this.userRepository.save(user);
        }
        return user;
    }
}
