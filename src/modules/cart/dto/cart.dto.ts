import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: '918390281938921' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ example: '918390281938921' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpadteCartQuantityDto {
  @ApiProperty({ example: '918390281938921' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ example: '918390281938921' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantityChange: number;
}
