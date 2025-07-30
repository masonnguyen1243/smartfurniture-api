import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AddToCartDto } from '@/modules/cart/dto/cart.dto';

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
}
