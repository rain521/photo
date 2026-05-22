import { AiService } from './ai.service';
export interface TemplateFrame {
    index: number;
    description: string;
    expectedType: string;
    orientation: string;
}
export interface MatchResult {
    templateIndex: number;
    frameCount: number;
    order: number[];
    frames?: TemplateFrame[];
}
export declare class AlbumService {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    matchSingleTemplate(templateImage: string | {
        url?: string;
        base64?: string;
    }, userImages: Array<string | {
        url?: string;
        base64?: string;
        id?: string;
    }>): Promise<number[]>;
    matchMultipleTemplates(templateImages: Array<string | {
        url?: string;
        base64?: string;
    }>, userImages: Array<string | {
        url?: string;
        base64?: string;
        id?: string;
    }>): Promise<any>;
    private buildMatchingPrompt;
    private buildMultiTemplatePrompt;
    private parseOrderResponse;
    private parseMultiTemplateResponse;
}
