import { User } from './user.entity';
import { Classify } from './classify.entity';
export declare class Photo {
    id: number | undefined;
    url: string;
    type: PhotoType;
    userId: number;
    user: User;
    classifyId?: number;
    classify?: Classify;
    createdAt: Date;
    isActive: boolean;
}
export type PhotoType = "background" | "mask" | "material";
