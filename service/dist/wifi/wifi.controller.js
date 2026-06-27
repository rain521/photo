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
exports.WifiController = void 0;
const common_1 = require("@nestjs/common");
const wifi_service_1 = require("./wifi.service");
const public_1 = require("../utils/public");
let WifiController = class WifiController {
    wifiService;
    constructor(wifiService) {
        this.wifiService = wifiService;
    }
    create(createWifiDto) {
        if (!createWifiDto.userId || !createWifiDto.name || !createWifiDto.password) {
            throw new common_1.InternalServerErrorException('数据不准确，请检查');
        }
        return this.wifiService.create(createWifiDto);
    }
    async getQrcode(page, scene, res) {
        console.log(page, scene);
        const buffer = await this.wifiService.createWxaQrcode(page, scene);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
    }
    findAll(req) {
        return this.wifiService.findAll(req.user.userId);
    }
    findOne(id) {
        return this.wifiService.findOne(id);
    }
    findOneByQuery(id) {
        return this.wifiService.findOne(id);
    }
    remove(id) {
        return this.wifiService.remove(id);
    }
    update(createWifiDto) {
        return this.wifiService.update(createWifiDto.id, createWifiDto);
    }
};
exports.WifiController = WifiController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WifiController.prototype, "create", null);
__decorate([
    (0, public_1.Public)(),
    (0, common_1.Get)('qrcode'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('scene')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WifiController.prototype, "getQrcode", null);
__decorate([
    (0, common_1.Get)('getAll'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WifiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WifiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WifiController.prototype, "findOneByQuery", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WifiController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WifiController.prototype, "update", null);
exports.WifiController = WifiController = __decorate([
    (0, common_1.Controller)('wifi'),
    __metadata("design:paramtypes", [wifi_service_1.WifiService])
], WifiController);
//# sourceMappingURL=wifi.controller.js.map