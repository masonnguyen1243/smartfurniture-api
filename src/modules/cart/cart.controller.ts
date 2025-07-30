import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CartService } from '@/modules/cart/cart.service';
import {
  AddToCartDto,
  UpadteCartQuantityDto,
} from '@/modules/cart/dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    try {
      const result = await this.cartService.addToCart(addToCartDto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  async updateCartQuantity(@Body() updateCartQuantity: UpadteCartQuantityDto) {
    try {
      const result =
        await this.cartService.updateCartQuantity(updateCartQuantity);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
