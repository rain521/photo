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
exports.ClassifyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const classify_entity_1 = require("../entities/classify.entity");
let ClassifyService = class ClassifyService {
    classifyRepository;
    constructor(classifyRepository) {
        this.classifyRepository = classifyRepository;
    }
    async create(data) {
        const item = this.classifyRepository.create(data);
        return await this.classifyRepository.save(item);
    }
    findAll(type) {
        const query = { order: { seq: 'ASC' }, where: {} };
        if (type) {
            query.where.type = type;
        }
        return this.classifyRepository.find(query);
    }
    async findOne(id) {
        const item = await this.classifyRepository.findOne({ where: { id } });
        return item;
    }
    async update(id, dto) {
        const data = await this.classifyRepository.findOne({ where: { id } });
        if (!data) {
            throw new common_1.NotFoundException(`分类(ID: ${id})不存在`);
        }
        try {
            const updated = this.classifyRepository.merge(data, dto);
            await this.classifyRepository.save(updated);
            return await this.findOne(id);
        }
        catch (err) {
            throw new common_1.BadRequestException('更新分类失败');
        }
    }
    async remove(id) {
        await this.classifyRepository.delete(id);
    }
    async findAndCount(query) {
        const [data, total] = await this.classifyRepository.findAndCount(query);
        return [data, total];
    }
};
exports.ClassifyService = ClassifyService;
exports.ClassifyService = ClassifyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(classify_entity_1.Classify)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClassifyService);
//# sourceMappingURL=classify.service.js.map