import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { WishlistService } from '@/modules/wishlist/wishlist.service';
import { CreateWishlistDto } from '@/modules/wishlist/dto/wishlist.dto';
import { Public } from '@/decorators/customize';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @Public()
  async addToWishlist(@Body() createWishlistDto: CreateWishlistDto) {
    try {
      return this.wishlistService.addToWishlist(createWishlistDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @Public()
  async removeWishlist(@Param('id') id: string) {
    try {
      return this.wishlistService.removeWishlist(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
