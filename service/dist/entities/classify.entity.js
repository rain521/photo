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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classify = void 0;
const typeorm_1 = require("typeorm");
const photo_entity_1 = require("./photo.entity");
let Classify = class Classify {
    id;
    name;
    seq;
    isActive;
    type;
    photos;
    createdAt;
    updatedAt;
};
exports.Classify = Classify;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Classify.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Classify.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Classify.prototype, "seq", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Classify.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["background", "mask", "material"],
        default: "material"
    }),
    __metadata("design:type", String)
], Classify.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => photo_entity_1.Photo, photo => photo.classify, {
        cascade: ['insert', 'update'],
        eager: false,
    }),
    __metadata("design:type", Array)
], Classify.prototype, "photos", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Classify.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Classify.prototype, "updatedAt", void 0);
exports.Classify = Classify = __decorate([
    (0, typeorm_1.Entity)()
], Classify);
//# sourceMappingURL=classify.entity.js.map