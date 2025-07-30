import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({ example: '3781279831231321321' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: '0910-39-0123012' })
  @IsNotEmpty()
  @IsString()
  productId: string;
}
