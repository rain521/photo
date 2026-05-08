// qwen/qwen.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private model: ChatOpenAI;

    constructor(private configService: ConfigService) {
        // 千问 API 兼容 OpenAI 格式
        this.model = new ChatOpenAI({
            apiKey: this.configService.get('DASHSCOPE_API_KEY'),
            configuration: {
                baseURL: this.configService.get('DASHSCOPE_BASE_URL'),
            },
            model: 'qwen-vl-max',  // 或 qwen3-omni
            temperature: 0.2,
            maxTokens: 4096,
        });
    }

    /**
     * 将图片转换为 Base64
     */
    private async imageToBase64(imageUrlOrPath: string): Promise<string> {
        // 如果是 URL，下载并转换
        if (imageUrlOrPath.startsWith('http')) {
            const response = await fetch(imageUrlOrPath);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const contentType = response.headers.get('content-type') || 'image/jpeg';
            return `data:${contentType};base64,${base64}`;
        }
        // 如果是本地路径，读取文件
        const fs = await import('fs/promises');
        const buffer = await fs.readFile(imageUrlOrPath);
        const base64 = buffer.toString('base64');
        return `data:image/jpeg;base64,${base64}`;
    }

    /**
     * 多模态识别 - 从 URL 或 Base64 识别图片
     */
    async recognizeImage(
        image: string | { url?: string; base64?: string },
        textPrompt: string,
    ): Promise<string> {
        let imageData: string;

        if (typeof image === 'string') {
            imageData = image.startsWith('data:image') ? image : await this.imageToBase64(image);
        } else if (image.url) {
            imageData = await this.imageToBase64(image.url);
        } else if (image.base64) {
            imageData = image.base64.startsWith('data:image')
                ? image.base64
                : `data:image/jpeg;base64,${image.base64}`;
        } else {
            throw new Error('Invalid image input');
        }

        // 构建多模态消息
        // LangChain 的多模态消息格式：[citation:6]
        const message = new HumanMessage({
            content: [
                { type: 'text', text: textPrompt },
                { type: 'image_url', image_url: imageData },
            ],
        });

        const response = await this.model.invoke([message]);
        return response.content as string;
    }

    /**
     * 批量识别多张图片（适合相册模板场景）
     */
    async analyzeMultipleImages(
        images: Array<string | { url?: string; base64?: string }>,
        contextPrompt: string,
    ): Promise<string> {
        const content: Array<{ type: string; text?: string; image_url?: string }> = [
            { type: 'text', text: contextPrompt },
        ];

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            let imageData: string;

            if (typeof img === 'string') {
                imageData = img.startsWith('data:image') ? img : await this.imageToBase64(img);
            } else if (img.url) {
                imageData = await this.imageToBase64(img.url);
            } else if (img.base64) {
                imageData = img.base64.startsWith('data:image')
                    ? img.base64
                    : `data:image/jpeg;base64,${img.base64}`;
            } else {
                continue;
            }

            content.push({ type: 'image_url', image_url: imageData });
            content.push({ type: 'text', text: `图片 ${i}` });
        }

        const message = new HumanMessage({ content });
        const response = await this.model.invoke([message]);
        return response.content as string;
    }
}