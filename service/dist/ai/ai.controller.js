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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const album_service_1 = require("./album.service");
const public_1 = require("../utils/public");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let AiController = class AiController {
    albumService;
    constructor(albumService) {
        this.albumService = albumService;
    }
    async matchTemplate(body) {
        const order = await this.albumService.matchSingleTemplate(body.templateImage, body.userImages);
        return {
            success: true,
            order,
        };
    }
    async matchMultiTemplates(body) {
        const { orderUrls, ...result } = await this.albumService.matchMultipleTemplates(body.templates, body.userImages);
        return {
            orderUrls,
            ...result,
        };
    }
    sendEvents() {
        return (0, rxjs_1.interval)(1000).pipe((0, operators_1.map)((count) => ({
            data: `第 ${count + 1} 次推送`,
        })));
    }
};
exports.AiController = AiController;
__decorate([
    (0, public_1.Public)(),
    (0, common_1.Post)('match'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "matchTemplate", null);
__decorate([
    (0, public_1.Public)(),
    (0, common_1.Post)('match-multi'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "matchMultiTemplates", null);
__decorate([
    (0, public_1.Public)(),
    (0, common_1.Sse)('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], AiController.prototype, "sendEvents", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [album_service_1.AlbumService])
], AiController);
//# sourceMappingURL=ai.controller.js.map