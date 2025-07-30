import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'john doe' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '123456789' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'Ha Noi' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '0987654321' })
  @IsOptional()
  @IsString()
  phone?: string;
}
