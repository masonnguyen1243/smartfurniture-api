import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { CartService } from '@/modules/cart/cart.service';
import {
  AddToCartDto,
  UpdateCartQuantityDto,
} from '@/modules/cart/dto/cart.dto';
import { Public } from '@/decorators/customize';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @Public()
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    try {
      const result = await this.cartService.addToCart(addToCartDto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @Public()
  async updateCartQuantity(@Body() updateCartQuantity: UpdateCartQuantityDto) {
    try {
      const result =
        await this.cartService.updateCartQuantity(updateCartQuantity);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @Public()
  async removeCart(@Param('id') id: string) {
    return this.cartService.removeCart(id);
  }
}
