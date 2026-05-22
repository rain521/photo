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
var AlbumService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
let AlbumService = AlbumService_1 = class AlbumService {
    aiService;
    logger = new common_1.Logger(AlbumService_1.name);
    constructor(aiService) {
        this.aiService = aiService;
    }
    async matchSingleTemplate(templateImage, userImages) {
        const prompt = this.buildMatchingPrompt(userImages.length);
        const allImages = [templateImage, ...userImages];
        const response = await this.aiService.analyzeMultipleImages(allImages, prompt);
        return this.parseOrderResponse(response, userImages.length);
    }
    async matchMultipleTemplates(templateImages, userImages) {
        const prompt = this.buildMultiTemplatePrompt(templateImages.length, userImages.length);
        const allImages = [...templateImages, ...userImages];
        const result = await this.aiService.analyzeMultipleImages(allImages, prompt);
        const parsed = this.parseMultiTemplateResponse(result, userImages.length);
        const orderUrls = parsed.order.map(idx => {
            const img = userImages[idx];
            if (typeof img === 'string')
                return img;
            if (img && 'url' in img)
                return img.url;
            return '';
        });
        return {
            ...parsed,
            orderUrls,
        };
    }
    buildMatchingPrompt(userImageCount) {
        return `
你是一位专业的相册排版设计师。

任务：
1. 识别第一张图片（模板图）中所有的图片框（相框）。注意：相框是模板中留空用于放置照片的矩形区域。
2. 分析后续 ${userImageCount} 张用户图片的内容（人脸数量、构图方向、场景类型）。
3. 为每个相框分配最合适的用户图片，使得整体匹配度最高。

匹配原则：
- 单人肖像框 → 优先选择只有一张人脸且人脸占比高的图片
- 多人合影框 → 优先选择人脸数 ≥ 2 的图片
- 风景宽幅框 → 优先选择无人物、横向构图的风景照
- 美食/静物框 → 优先选择食物或物品特写

返回格式：仅返回一个 JSON 数组，长度为相框数量，元素为用户图片的索引（从 0 开始）。
例如：[2, 0, 1] 表示第一个相框放图片2，第二个放图片0，第三个放图片1。
如果某张图片不适合任何相框，用 -1 表示。

只返回 JSON 数组，不要其他内容。
    `;
    }
    buildMultiTemplatePrompt(templateCount, userImageCount) {
        return `
你是一位专业的相册排版设计师。

任务：
1. 分析前 ${templateCount} 张模板图，识别每个模板中的图片框数量、类型和布局。
2. 分析后续 ${userImageCount} 张用户图片的内容（人脸数量、构图方向、场景类型）。
3. 从所有模板中选择一个最能完美容纳这些用户图片的模板（相框数量接近用户图片数量，且相框类型与图片内容匹配度高）。
4. 为选中的模板生成填充顺序：按相框从左到右、从上到下的顺序，返回用户图片索引数组。

返回格式：仅返回一个 JSON 对象：
{
  "templateIndex": 0,           // 选中的模板索引（0-based）
  "frameCount": 4,              // 相框数量
  "order": [2, 0, 3, 1]        // 填充顺序
}

只返回 JSON，不要其他内容。
    `;
    }
    parseOrderResponse(response, userImageCount) {
        const jsonMatch = response.match(/\[[\s\S]*?\]/);
        if (!jsonMatch) {
            this.logger.error(`Failed to parse response: ${response}`);
            return [];
        }
        try {
            const order = JSON.parse(jsonMatch[0]);
            if (!Array.isArray(order)) {
                throw new Error('Response is not an array');
            }
            return order;
        }
        catch (e) {
            this.logger.error(`JSON parse error: ${e.message}`);
            return [];
        }
    }
    parseMultiTemplateResponse(response, userImageCount) {
        const jsonMatch = response.match(/\{[\s\S]*?\}/);
        if (!jsonMatch) {
            this.logger.error(`Failed to parse response: ${response}`);
            return { templateIndex: 0, frameCount: 0, order: [] };
        }
        try {
            const result = JSON.parse(jsonMatch[0]);
            return {
                templateIndex: result.templateIndex ?? 0,
                frameCount: result.frameCount ?? 0,
                order: result.order ?? [],
                frames: result.frames,
            };
        }
        catch (e) {
            this.logger.error(`JSON parse error: ${e.message}`);
            return { templateIndex: 0, frameCount: 0, order: [] };
        }
    }
};
exports.AlbumService = AlbumService;
exports.AlbumService = AlbumService = AlbumService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AlbumService);
//# sourceMappingURL=album.service.js.map