// src/users/dto/create-user.dto.ts
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches,
  IsOptional,
  IsBoolean,
  IsNumber
} from 'class-validator';
export type photoType = "background" | "mask" | "material";

export class PhotoDto {

  @IsString()
  url: string;

  @IsString()
  type: photoType;
  
  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  @IsOptional()
  classifyId?: number;
}