import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpadteCartQuantityDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNumber()
  quantityChange: number;
}
