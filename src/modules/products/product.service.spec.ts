import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '@/modules/products/product.service';
import { PrismaService } from '@/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from '@/modules/products/dto/product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  const mockProduct = {
    id: '123',
    name: 'Test Product',
    description: 'This is a test product',
    price: 100,
    imageUrl: 'http://example.com/image.jpg',
    categoryId: 'cat123',
    category: { name: 'Furniture' },
  };

  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('Create Product', () => {
    it('should create a product', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        imageUrl: 'http://example.com/image.jpg',
        categoryId: 'cat123',
      };

      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.create(createDto);

      expect(prisma.product.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('Find all and Paginate product', () => {
    it('should return paginated products', async () => {
      (prisma.product.count as jest.Mock).mockResolvedValue(20);
      (prisma.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);

      const result = await service.findAll(1, 10);

      expect(prisma.product.count).toHaveBeenCalled();
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: { category: { select: { name: true } } },
      });

      expect(result).toEqual({
        data: [mockProduct],
        currentPage: 1,
        totalPages: 2,
        totalItems: 20,
      });
    });
  });

  describe('Get product details', () => {
    it('should return a product by id', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.findOne('123');

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('Update product', () => {
    it('should update a product', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 200,
      };

      const result = await service.update('123', updateDto);

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: updateDto,
        include: { category: { select: { name: true } } },
      });

      expect(result).toEqual({
        updatedProduct: mockProduct,
        success: true,
        message: 'Update product successfully',
      });
    });
  });

  describe('Remove product', () => {
    it('should remove a product', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
      (prisma.product.delete as jest.Mock).mockResolvedValue(mockProduct);

      const result = await service.remove('123');

      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: '123' },
      });
      expect(result).toEqual({ message: 'Delete successfully' });
    });
  });
});
