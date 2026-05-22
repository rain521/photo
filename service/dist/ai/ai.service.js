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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
let AiService = AiService_1 = class AiService {
    configService;
    logger = new common_1.Logger(AiService_1.name);
    model;
    constructor(configService) {
        this.configService = configService;
        this.model = new openai_1.ChatOpenAI({
            apiKey: this.configService.get('DASHSCOPE_API_KEY'),
            configuration: {
                baseURL: this.configService.get('DASHSCOPE_BASE_URL'),
            },
            model: 'qwen-vl-max',
            temperature: 0.2,
            maxTokens: 4096,
        });
    }
    async imageToBase64(imageUrlOrPath) {
        if (imageUrlOrPath.startsWith('http')) {
            const response = await fetch(imageUrlOrPath);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const contentType = response.headers.get('content-type') || 'image/jpeg';
            return `data:${contentType};base64,${base64}`;
        }
        const fs = await Promise.resolve().then(() => require('fs/promises'));
        const buffer = await fs.readFile(imageUrlOrPath);
        const base64 = buffer.toString('base64');
        return `data:image/jpeg;base64,${base64}`;
    }
    async recognizeImage(image, textPrompt) {
        let imageData;
        if (typeof image === 'string') {
            imageData = image.startsWith('data:image') ? image : await this.imageToBase64(image);
        }
        else if (image.url) {
            imageData = await this.imageToBase64(image.url);
        }
        else if (image.base64) {
            imageData = image.base64.startsWith('data:image')
                ? image.base64
                : `data:image/jpeg;base64,${image.base64}`;
        }
        else {
            throw new Error('Invalid image input');
        }
        const message = new messages_1.HumanMessage({
            content: [
                { type: 'text', text: textPrompt },
                { type: 'image_url', image_url: imageData },
            ],
        });
        const response = await this.model.invoke([message]);
        return response.content;
    }
    async analyzeMultipleImages(images, contextPrompt) {
        const content = [
            { type: 'text', text: contextPrompt },
        ];
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            let imageData;
            if (typeof img === 'string') {
                imageData = img.startsWith('data:image') ? img : await this.imageToBase64(img);
            }
            else if (img.url) {
                imageData = await this.imageToBase64(img.url);
            }
            else if (img.base64) {
                imageData = img.base64.startsWith('data:image')
                    ? img.base64
                    : `data:image/jpeg;base64,${img.base64}`;
            }
            else {
                continue;
            }
            content.push({ type: 'image_url', image_url: imageData });
            content.push({ type: 'text', text: `图片 ${i}` });
        }
        const message = new messages_1.HumanMessage({ content });
        const response = await this.model.invoke([message]);
        return response.content;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map