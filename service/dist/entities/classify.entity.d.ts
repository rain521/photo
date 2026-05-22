import { Photo } from './photo.entity';
export declare class Classify {
    id: number;
    name: string;
    seq: number;
    isActive: boolean;
    type: type;
    photos?: Photo[];
    createdAt: Date;
    updatedAt: Date;
}
export type type = "background" | "mask" | "material";
