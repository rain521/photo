export type photoType = "background" | "mask" | "material";
export declare class PhotoDto {
    url: string;
    type: photoType;
    isActive: boolean;
    classifyId?: number;
}
