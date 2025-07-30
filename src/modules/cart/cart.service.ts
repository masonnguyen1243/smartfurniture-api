import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AddToCartDto,
  UpadteCartQuantityDto,
} from '@/modules/cart/dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(addToCartDto: AddToCartDto) {
    const { productId, userId, quantity } = addToCartDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const existingCart = await this.prisma.cart.findFirst({
      where: { productId, userId },
    });

    if (existingCart) {
      const result = await this.prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          quantity: existingCart.quantity + quantity,
          totalPrice: product.price * (existingCart.quantity + quantity),
        },
      });

      return { message: 'Add to cart successfully!', result };
    }

    const result = await this.prisma.cart.create({
      data: {
        productId,
        userId,
        quantity,
        totalPrice: product.price * quantity,
      },
      include: {
        product: true,
      },
    });

    return { message: 'Add to cart successfully!', result };
  }

  async updateCartQuantity(updateCartQuantity: UpadteCartQuantityDto) {
    const { userId, productId, quantityChange } = updateCartQuantity;
    const existingCart = await this.prisma.cart.findFirst({
      where: { userId, productId },
      include: { product: true },
    });

    if (!existingCart) {
      throw new NotFoundException('Product is not in cart');
    }

    const newQuantity = existingCart.quantity + quantityChange;

    if (newQuantity <= 0) {
      await this.prisma.cart.delete({
        where: { id: existingCart.id },
      });
      return { message: 'Product removed from cart' };
    }

    const updatedCart = await this.prisma.cart.update({
      where: { id: existingCart.id },
      data: {
        quantity: newQuantity,
        totalPrice: existingCart.product.price * newQuantity,
      },
      include: {
        product: true,
      },
    });

    return updatedCart;
  }
}
