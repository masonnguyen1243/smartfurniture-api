import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '@/modules/cart/cart.service';
import { PrismaService } from '@/prisma.service';
import { NotFoundException } from '@nestjs/common';
import {
  AddToCartDto,
  UpdateCartQuantityDto,
} from '@/modules/cart/dto/cart.dto';

describe('CartService', () => {
  let service: CartService;
  let prisma: PrismaService;

  const mockPrisma = {
    product: {
      findUnique: jest.fn(),
    },
    cart: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('addToCart', () => {
    it('should throw NotFoundException if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.addToCart({
          productId: 'p1',
          userId: 'u1',
          quantity: 2,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update existing cart item if already exists', async () => {
      const product = { id: 'p1', price: 100 };
      const existingCart = { id: 'c1', quantity: 1 };

      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.cart.findFirst.mockResolvedValue(existingCart);
      mockPrisma.cart.update.mockResolvedValue({
        id: 'c1',
        quantity: 3,
        totalPrice: 300,
      });

      const result = await service.addToCart({
        productId: 'p1',
        userId: 'u1',
        quantity: 2,
      });

      expect(result.message).toBe('Add to cart successfully!');
      expect(mockPrisma.cart.update).toHaveBeenCalledWith({
        where: { id: existingCart.id },
        data: {
          quantity: 3,
          totalPrice: 300,
        },
      });
    });

    it('should create new cart item if not exists', async () => {
      const product = { id: 'p1', price: 100 };

      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.cart.findFirst.mockResolvedValue(null);
      mockPrisma.cart.create.mockResolvedValue({
        id: 'new',
        productId: 'p1',
        userId: 'u1',
        quantity: 2,
        totalPrice: 200,
      });

      const result = await service.addToCart({
        productId: 'p1',
        userId: 'u1',
        quantity: 2,
      });

      expect(result.message).toBe('Add to cart successfully!');
      expect(mockPrisma.cart.create).toHaveBeenCalled();
    });
  });

  describe('updateCartQuantity', () => {
    it('should throw NotFoundException if cart item not found', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue(null);

      await expect(
        service.updateCartQuantity({
          productId: 'p1',
          userId: 'u1',
          quantityChange: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should remove cart if new quantity <= 0', async () => {
      const cart = {
        id: 'c1',
        quantity: 1,
        product: { price: 100 },
      };

      mockPrisma.cart.findFirst.mockResolvedValue(cart);
      mockPrisma.cart.delete.mockResolvedValue({});

      const result = await service.updateCartQuantity({
        productId: 'p1',
        userId: 'u1',
        quantityChange: -1,
      });

      expect(result);
      expect(mockPrisma.cart.delete).toHaveBeenCalledWith({
        where: { id: cart.id },
      });
    });

    it('should update cart with new quantity and totalPrice', async () => {
      const cart = {
        id: 'c1',
        quantity: 2,
        product: { price: 100 },
      };

      mockPrisma.cart.findFirst.mockResolvedValue(cart);
      mockPrisma.cart.update.mockResolvedValue({
        id: 'c1',
        quantity: 3,
        totalPrice: 300,
      });

      const result = await service.updateCartQuantity({
        productId: 'p1',
        userId: 'u1',
        quantityChange: 1,
      });

      expect(result);
    });
  });

  describe('removeCart', () => {
    it('should throw NotFoundException if cart not found', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(null);

      await expect(service.removeCart('c1')).rejects.toThrow(NotFoundException);
    });

    it('should delete cart item if exists', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 'c1' });
      mockPrisma.cart.delete.mockResolvedValue({});

      const result = await service.removeCart('c1');
      expect(result.message).toBe('Remove cart successfully!');
      expect(mockPrisma.cart.delete).toHaveBeenCalledWith({
        where: { id: 'c1' },
      });
    });
  });
});
