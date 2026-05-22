import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private readonly logger;
    private model;
    constructor(configService: ConfigService);
    private imageToBase64;
    recognizeImage(image: string | {
        url?: string;
        base64?: string;
    }, textPrompt: string): Promise<string>;
    analyzeMultipleImages(images: Array<string | {
        url?: string;
        base64?: string;
    }>, contextPrompt: string): Promise<string>;
}
