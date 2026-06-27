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
exports.WifiService = void 0;
const common_1 = require("@nestjs/common");
const wifi_entity_1 = require("../entities/wifi.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
let WifiService = class WifiService {
    wifiRepository;
    configService;
    constructor(wifiRepository, configService) {
        this.wifiRepository = wifiRepository;
        this.configService = configService;
    }
    async create(createWifiDto) {
        const data = this.wifiRepository.create(createWifiDto);
        return await this.wifiRepository.save(data);
    }
    async findAll(userId) {
        const data = await this.wifiRepository.find({ where: { userId } });
        return data;
    }
    async findOne(id) {
        return this.wifiRepository.findOne({ where: { id } });
    }
    async update(id, updateWifiDto) {
        await this.wifiRepository.update(id, updateWifiDto);
        return this.findOne(id);
    }
    async remove(id) {
        return this.wifiRepository.delete(id);
    }
    async createWxaQrcode(page, scene) {
        const accessToken = await this.getAccessToken();
        const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;
        const requestBody = {
            scene,
            page,
            width: 280,
            auto_color: false,
            line_color: { r: 0, g: 0, b: 0 },
            is_hyaline: false,
        };
        const response = await axios_1.default.post(url, requestBody, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const imageBuffer = Buffer.from(response.data);
        return imageBuffer;
    }
    async getAccessToken() {
        const appId = this.configService.get('WX_APPID');
        const appSecret = this.configService.get('WX_SECRET');
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
        const { data } = await axios_1.default.get(url);
        return data.access_token;
    }
};
exports.WifiService = WifiService;
exports.WifiService = WifiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(wifi_entity_1.Wifi)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        config_1.ConfigService])
], WifiService);
//# sourceMappingURL=wifi.service.js.map