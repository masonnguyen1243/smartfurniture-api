import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '@/modules/categories/categories.service';
import { PrismaService } from '@/prisma.service';
import { CategoriesDto } from '@/modules/categories/dto/categories.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockCategory = {
    id: 'cat123',
    name: 'Furniture',
  };

  const mockPrismaService = {
    categories: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('Create category', () => {
    it('should create a category', async () => {
      const dto: CategoriesDto = { name: 'Furniture' };
      (prisma.categories.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.create(dto);

      expect(prisma.categories.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockCategory);
    });
  });

  describe('Get all category', () => {
    it('should return all categories', async () => {
      const expected = [mockCategory];
      (prisma.categories.findMany as jest.Mock).mockResolvedValue(expected);

      const result = await service.findAll();

      expect(prisma.categories.findMany).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('Get an category', () => {
    it('should return a category by id', async () => {
      (prisma.categories.findUnique as jest.Mock).mockResolvedValue(
        mockCategory,
      );

      const result = await service.findOne('cat123');

      expect(prisma.categories.findUnique).toHaveBeenCalledWith({
        where: { id: 'cat123' },
      });
      expect(result).toEqual(mockCategory);
    });
  });

  describe('Update category', () => {
    it('should update a category', async () => {
      const dto: CategoriesDto = { name: 'Updated Name' };
      const updated = { ...mockCategory, name: dto.name };
      (prisma.categories.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('cat123', dto);

      expect(prisma.categories.update).toHaveBeenCalledWith({
        where: { id: 'cat123' },
        data: dto,
      });
      expect(result).toEqual(updated);
    });
  });

  describe('Delete category', () => {
    it('should delete a category', async () => {
      (prisma.categories.delete as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.remove('cat123');

      expect(prisma.categories.delete).toHaveBeenCalledWith({
        where: { id: 'cat123' },
      });
      expect(result).toEqual(mockCategory);
    });
  });
});
