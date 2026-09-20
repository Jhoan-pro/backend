import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @Matches(/\S/)
  email: string;

  @ApiProperty({ minLength: 6, format: 'password' })
  @IsString()
  @MinLength(6)
  @Matches(/\S/)
  password: string;
}
