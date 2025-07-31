import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '@/modules/cart/cart.controller';
import { CartService } from '@/modules/cart/cart.service';
import {
  AddToCartDto,
  UpdateCartQuantityDto,
} from '@/modules/cart/dto/cart.dto';

describe('CartController', () => {
  let cartController: CartController;
  let cartService: CartService;

  const mockCartService = {
    addToCart: jest.fn(),
    updateCartQuantity: jest.fn(),
    removeCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    cartController = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);

    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    it('should add item to cart and return result', async () => {
      const dto: AddToCartDto = {
        productId: 'product1',
        userId: 'user1',
        quantity: 2,
      };
      const mockResult = { message: 'Added to cart' };
      mockCartService.addToCart.mockResolvedValue(mockResult);

      const result = await cartController.addToCart(dto);
      expect(result).toEqual(mockResult);
      expect(mockCartService.addToCart).toHaveBeenCalledWith(dto);
    });

    it('should throw HttpException if service fails', async () => {
      const dto: AddToCartDto = {
        productId: 'product1',
        userId: 'user1',
        quantity: 2,
      };
      mockCartService.addToCart.mockRejectedValue(new Error('Internal Error'));

      await expect(cartController.addToCart(dto)).rejects.toThrow(
        'Internal Error',
      );
    });
  });

  describe('updateCartQuantity', () => {
    it('should update cart quantity and return result', async () => {
      const dto: UpdateCartQuantityDto = {
        productId: 'product1',
        userId: 'user1',
        quantityChange: 1,
      };
      const mockResult = { message: 'Quantity updated' };
      mockCartService.updateCartQuantity.mockResolvedValue(mockResult);

      const result = await cartController.updateCartQuantity(dto);
      expect(result).toEqual(mockResult);
      expect(mockCartService.updateCartQuantity).toHaveBeenCalledWith(dto);
    });

    it('should throw HttpException if service fails', async () => {
      const dto: UpdateCartQuantityDto = {
        productId: 'product1',
        userId: 'user1',
        quantityChange: 1,
      };
      mockCartService.updateCartQuantity.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(cartController.updateCartQuantity(dto)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('removeCart', () => {
    it('should remove cart by id', async () => {
      const id = 'cart123';
      const mockResult = { message: 'Cart removed' };
      mockCartService.removeCart.mockResolvedValue(mockResult);

      const result = await cartController.removeCart(id);
      expect(result).toEqual(mockResult);
      expect(mockCartService.removeCart).toHaveBeenCalledWith(id);
    });
  });
});
