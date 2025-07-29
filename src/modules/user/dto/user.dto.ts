import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
