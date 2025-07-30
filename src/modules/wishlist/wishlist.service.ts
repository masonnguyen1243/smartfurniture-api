import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from '@/modules/wishlist/dto/wishlist.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async addToWishlist(createWishlistDto: CreateWishlistDto) {
    const { userId, productId } = createWishlistDto;

    const existing = await this.prisma.wishList.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      throw new BadRequestException('Product is already in wishlist');
    }

    const wishlist = await this.prisma.wishList.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    return { message: 'Add to wishlist successfully', wishlist };
  }

  async removeWishlist(id: string) {
    const wishlistItem = await this.prisma.wishList.findFirst({
      where: { id },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.prisma.wishList.delete({ where: { id } });

    return { message: 'Removed successfully!' };
  }
}
