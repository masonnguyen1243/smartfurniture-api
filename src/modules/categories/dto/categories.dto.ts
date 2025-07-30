import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoriesDto {
  @ApiPropertyOptional({ example: 'Category name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
