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
exports.PhotoService = void 0;
const common_1 = require("@nestjs/common");
const photo_entity_1 = require("../entities/photo.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("typeorm");
const oss_service_1 = require("../oss/oss.service");
const classify_entity_1 = require("../entities/classify.entity");
let PhotoService = class PhotoService {
    photoRepository;
    classifyRepository;
    ossService;
    constructor(photoRepository, classifyRepository, ossService) {
        this.photoRepository = photoRepository;
        this.classifyRepository = classifyRepository;
        this.ossService = ossService;
    }
    async create(data, userId) {
        data.userId = userId;
        if (data.classifyId !== undefined && data.classifyId !== null) {
            const cls = await this.classifyRepository.findOne({ where: { id: data.classifyId } });
            if (!cls) {
                throw new common_1.BadRequestException('分类不存在');
            }
        }
        const item = this.photoRepository.create(data);
        return await this.photoRepository.save(item);
    }
    async bulkCreate(items, userId) {
        if (!Array.isArray(items) || items.length === 0)
            return [];
        const classifyIds = Array.from(new Set(items.map(i => i.classifyId).filter(id => id !== undefined && id !== null)));
        if (classifyIds.length) {
            const exists = await this.classifyRepository.find({ where: { id: (0, typeorm_3.In)(classifyIds) } });
            const existsSet = new Set(exists.map(c => c.id));
            const missing = classifyIds.filter(id => !existsSet.has(id));
            if (missing.length) {
                throw new common_1.BadRequestException(`分类不存在: ${missing.join(',')}`);
            }
        }
        const toSave = items.map(i => ({ ...i, userId }));
        const created = this.photoRepository.create(toSave);
        const saved = await this.photoRepository.save(created);
        const clsMap = new Map();
        if (classifyIds.length) {
            const cls = await this.classifyRepository.find({ where: { id: (0, typeorm_3.In)(classifyIds) } });
            cls.forEach(c => clsMap.set(c.id, c.name));
        }
        const mapped = saved.map(s => ({
            ...s,
            classifyName: s.classifyId ? clsMap.get(s.classifyId) ?? null : null,
        }));
        return mapped;
    }
    async findAndCount(query) {
        const [data, total] = await this.photoRepository.findAndCount(query);
        const dataList = data.map(item => {
            const { classify, ...anyP } = item;
            return {
                ...anyP,
                classifyName: classify?.name ?? null,
            };
        });
        return [dataList, total];
    }
    async findOne(id) {
        const photo = await this.photoRepository.findOne({ where: { id: id }, relations: ['classify'] });
        if (!photo)
            return null;
        const { classify, ...anyP } = photo;
        return {
            ...anyP,
            classifyName: classify?.name ?? null,
        };
    }
    async update(photoDto) {
        const id = photoDto.id;
        const data = await this.photoRepository.findOne({ where: { id } });
        if (!data) {
            throw new common_1.NotFoundException(`图片不存在`);
        }
        try {
            const maybeClassifyId = photoDto.classifyId;
            if (maybeClassifyId !== undefined && maybeClassifyId !== null) {
                const cls = await this.classifyRepository.findOne({ where: { id: maybeClassifyId } });
                if (!cls) {
                    throw new common_1.BadRequestException('分类不存在');
                }
            }
            const updatedUser = this.photoRepository.merge(data, photoDto);
            await this.photoRepository.save(updatedUser);
            return await this.findOne(id);
        }
        catch (error) {
            throw new common_1.BadRequestException('更新图片失败，请稍后重试');
        }
    }
    async remove(id) {
        const data = await this.photoRepository.findOne({ where: { id } });
        if (!data) {
            throw new common_1.NotFoundException('图片不存在');
        }
        await this.photoRepository.delete(id);
        try {
            const url = data.url || '';
            let objectKey = '';
            try {
                const u = new URL(url);
                objectKey = u.pathname.replace(/^\//, '');
            }
            catch (e) {
                objectKey = url.replace(/^\//, '');
            }
            if (objectKey) {
                await this.ossService.deleteObject(objectKey);
            }
        }
        catch (err) {
        }
    }
};
exports.PhotoService = PhotoService;
exports.PhotoService = PhotoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(photo_entity_1.Photo)),
    __param(1, (0, typeorm_1.InjectRepository)(classify_entity_1.Classify)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        oss_service_1.OssService])
], PhotoService);
//# sourceMappingURL=photo.service.js.map