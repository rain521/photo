// src/users/dto/create-user.dto.ts
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches,
  IsOptional,
  IsBoolean
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, { 
    message: '用户名只能包含字母、数字和下划线' 
  })
  userName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, { 
    message: '密码只能包含字母、数字和下划线' 
  })
  password?: string;
  
  @IsBoolean()
  isActive: boolean;
}