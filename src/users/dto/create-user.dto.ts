import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../generated/prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
