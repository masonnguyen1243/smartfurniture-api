import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from '@/modules/wishlist/wishlist.service';
import { PrismaService } from '@/prisma.service';
import { CreateWishlistDto } from '@/modules/wishlist/dto/wishlist.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;
  let prisma: PrismaService;

  const mockPrisma = {
    wishList: {
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('addToWishlist', () => {
    it('should throw BadRequestException if product already in wishlist', async () => {
      mockPrisma.wishList.findFirst.mockResolvedValue({ id: 'existing' });

      const dto: CreateWishlistDto = {
        userId: 'user1',
        productId: 'product1',
      };

      await expect(service.addToWishlist(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrisma.wishList.findFirst).toHaveBeenCalledWith({
        where: { userId: dto.userId, productId: dto.productId },
      });
    });

    it('should create and return wishlist item if not existing', async () => {
      mockPrisma.wishList.findFirst.mockResolvedValue(null);

      const dto: CreateWishlistDto = {
        userId: 'user1',
        productId: 'product1',
      };

      const mockWishlist = {
        id: 'wishlist123',
        userId: dto.userId,
        productId: dto.productId,
        product: { name: 'Example Product' },
      };

      mockPrisma.wishList.create.mockResolvedValue(mockWishlist);

      const result = await service.addToWishlist(dto);
      expect(result).toEqual({
        message: 'Add to wishlist successfully',
        wishlist: mockWishlist,
      });
      expect(mockPrisma.wishList.create).toHaveBeenCalledWith({
        data: {
          userId: dto.userId,
          productId: dto.productId,
        },
        include: {
          product: true,
        },
      });
    });
  });

  describe('removeWishlist', () => {
    it('should throw NotFoundException if wishlist item not found', async () => {
      mockPrisma.wishList.findFirst.mockResolvedValue(null);

      await expect(service.removeWishlist('wishlist123')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrisma.wishList.findFirst).toHaveBeenCalledWith({
        where: { id: 'wishlist123' },
      });
    });

    it('should delete and return success message if wishlist item exists', async () => {
      const wishlistItem = { id: 'wishlist123' };

      mockPrisma.wishList.findFirst.mockResolvedValue(wishlistItem);
      mockPrisma.wishList.delete.mockResolvedValue({});

      const result = await service.removeWishlist('wishlist123');
      expect(result).toEqual({ message: 'Removed successfully!' });
      expect(mockPrisma.wishList.delete).toHaveBeenCalledWith({
        where: { id: 'wishlist123' },
      });
    });
  });
});
