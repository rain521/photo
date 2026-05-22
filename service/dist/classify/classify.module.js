"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassifyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const classify_service_1 = require("./classify.service");
const classify_controller_1 = require("./classify.controller");
const classify_entity_1 = require("../entities/classify.entity");
let ClassifyModule = class ClassifyModule {
};
exports.ClassifyModule = ClassifyModule;
exports.ClassifyModule = ClassifyModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([classify_entity_1.Classify])],
        providers: [classify_service_1.ClassifyService],
        controllers: [classify_controller_1.ClassifyController]
    })
], ClassifyModule);
//# sourceMappingURL=classify.module.js.map