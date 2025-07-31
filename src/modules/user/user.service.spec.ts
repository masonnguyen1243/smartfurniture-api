import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@/modules/user/user.service';
import { PrismaService } from '@/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '@/modules/user/dto/user.dto';
import * as utils from '@/helpers/utils';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockUser = {
    id: 'user123',
    name: 'John Doe',
    address: '123 Street',
    phone: '0123456789',
    password: 'hashed-password',
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('updateProfile', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProfile('user123', {} as UpdateUserDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update profile without changing password', async () => {
      const dto: UpdateUserDto = { name: 'New Name' };
      const updatedUser = { ...mockUser, name: 'New Name' };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user123', dto);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: {
          name: 'New Name',
          address: mockUser.address,
          phone: mockUser.phone,
          password: mockUser.password,
        },
      });

      expect(result).toEqual({
        success: true,
        message: 'Update profile successfully',
        rest: {
          id: updatedUser.id,
          name: updatedUser.name,
          address: updatedUser.address,
          phone: updatedUser.phone,
        },
      });
    });

    it('should update profile and hash password if provided', async () => {
      const dto: UpdateUserDto = {
        name: 'New Name',
        password: 'new-password',
      };
      const hashed = 'new-hashed-pass';

      jest.spyOn(utils, 'hashPasswordHelper').mockResolvedValue(hashed);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue({
        ...mockUser,
        name: 'New Name',
        password: hashed,
      });

      const result = await service.updateProfile('user123', dto);

      expect(utils.hashPasswordHelper).toHaveBeenCalledWith('new-password');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user123' },
        data: {
          name: 'New Name',
          address: mockUser.address,
          phone: mockUser.phone,
          password: hashed,
        },
      });

      expect(result.success).toBe(true);
    });
  });

  describe('deleteUser', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser('user123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete user if found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.delete.mockResolvedValue(undefined);

      await service.deleteUser('user123');

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'user123' },
      });
    });
  });
});
