import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Product name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Product desc' })
  @IsString()
  description?: string;

  @ApiProperty({ example: 321 })
  @IsOptional()
  @IsNumber()
  oldPrice?: number;

  @ApiProperty({ example: 321 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 321 })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ example: 'image url' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: '918390281938921' })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Product desc' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 321 })
  @IsOptional()
  @IsNumber()
  oldPrice?: number;

  @ApiProperty({ example: 321 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 321 })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 'image url' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: '918390281938921' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
