import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
}
