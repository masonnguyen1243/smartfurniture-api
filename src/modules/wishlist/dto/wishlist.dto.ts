import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;
}
