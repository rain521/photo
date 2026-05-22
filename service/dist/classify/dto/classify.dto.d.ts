export type type = "background" | "mask" | "material";
export declare class CreateClassifyDto {
    name: string;
    seq: number;
    isActive?: boolean;
    type: type;
}
