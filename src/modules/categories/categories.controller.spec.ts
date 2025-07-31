import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '@/modules/categories/categories.controller';
import { CategoriesService } from '@/modules/categories/categories.service';
import { CategoriesDto } from '@/modules/categories/dto/categories.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory = {
    id: 'cat123',
    name: 'Furniture',
  };

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  describe('Create category', () => {
    it('should create and return a category', async () => {
      const dto: CategoriesDto = { name: 'Furniture' };
      (service.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('Get all category', () => {
    it('should return all categories', async () => {
      const expected = [mockCategory];
      (service.findAll as jest.Mock).mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('Get an category', () => {
    it('should return a single category by id', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(mockCategory);

      const result = await controller.findOne('cat123');

      expect(service.findOne).toHaveBeenCalledWith('cat123');
      expect(result).toEqual(mockCategory);
    });
  });

  describe('Update category', () => {
    it('should update a category', async () => {
      const dto: CategoriesDto = { name: 'Updated Name' };
      const updatedCategory = { ...mockCategory, name: dto.name };

      (service.update as jest.Mock).mockResolvedValue(updatedCategory);

      const result = await controller.update('cat123', dto);

      expect(service.update).toHaveBeenCalledWith('cat123', dto);
      expect(result).toEqual(updatedCategory);
    });
  });

  describe('Remove category', () => {
    it('should remove a category', async () => {
      (service.remove as jest.Mock).mockResolvedValue({
        message: 'Deleted successfully',
      });

      const result = await controller.remove('cat123');

      expect(service.remove).toHaveBeenCalledWith('cat123');
      expect(result).toEqual({ message: 'Deleted successfully' });
    });
  });
});
