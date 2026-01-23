import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export type type = "background" | "mask" | "material";
export class CreateClassifyDto {
    @IsString()
    name: string;

    @IsNumber()
    @Min(0)
    seq: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsString()
    type: type;
}
