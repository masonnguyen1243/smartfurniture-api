import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '@/modules/products/product.controller';
import { ProductService } from '@/modules/products/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from '@/modules/products/dto/product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const dto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        imageUrl: 'http://example.com/image.jpg',
        categoryId: 'abc123',
      };
      const result = { id: '1', ...dto };

      mockProductService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const result = {
        data: [{ id: '1', name: 'Product 1' }],
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
      };

      mockProductService.findAll.mockResolvedValue(result);

      expect(await controller.findAll('1', '10')).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { id: '1', name: 'Product 1' };
      mockProductService.findOne.mockResolvedValue(product);

      expect(await controller.findOne('1')).toEqual(product);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update and return a product', async () => {
      const dto: UpdateProductDto = { name: 'Updated Name' };
      const result = { id: '1', ...dto };

      mockProductService.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove and return confirmation', async () => {
      const result = { message: 'Product removed' };
      mockProductService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
