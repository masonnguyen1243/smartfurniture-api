import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from '@/modules/wishlist/wishlist.controller';
import { WishlistService } from '@/modules/wishlist/wishlist.service';
import { CreateWishlistDto } from '@/modules/wishlist/dto/wishlist.dto';
import { HttpException } from '@nestjs/common';

describe('WishlistController', () => {
  let controller: WishlistController;
  let service: WishlistService;

  const mockWishlistService = {
    addToWishlist: jest.fn(),
    removeWishlist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: mockWishlistService,
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
    service = module.get<WishlistService>(WishlistService);

    jest.clearAllMocks();
  });

  describe('addToWishlist', () => {
    it('hould add item to wishlist and return result', async () => {
      const dto: CreateWishlistDto = {
        userId: 'user123',
        productId: 'product123',
      };
      const expected = { message: 'Added to wishlist' };

      mockWishlistService.addToWishlist.mockResolvedValue(expected);

      const result = await controller.addToWishlist(dto);
      expect(result).toEqual(expected);
      expect(mockWishlistService.addToWishlist).toHaveBeenCalledWith(dto);
    });

    it('should throw HttpException if service fails', async () => {
      const dto: CreateWishlistDto = {
        userId: 'user123',
        productId: 'product123',
      };
      mockWishlistService.addToWishlist.mockImplementation(() => {
        throw new Error('Service error');
      });

      await expect(controller.addToWishlist(dto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('removeWishlist', () => {
    it('should remove from wishlist by id', async () => {
      const id = 'wishlist123';
      const expected = { message: 'Removed from wishlist' };

      mockWishlistService.removeWishlist.mockResolvedValue(expected);

      const result = await controller.removeWishlist(id);
      expect(result).toEqual(expected);
      expect(mockWishlistService.removeWishlist).toHaveBeenCalledWith(id);
    });

    it('should throw HttpException if service fails', async () => {
      const id = 'wishlist123';
      mockWishlistService.removeWishlist.mockImplementation(() => {
        throw new Error('Remove error');
      });

      await expect(controller.removeWishlist(id)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
