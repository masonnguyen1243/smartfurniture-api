import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/modules/user/user.controller';
import { UserService } from '@/modules/user/user.service';
import { UpdateUserDto } from '@/modules/user/dto/user.dto';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    updateProfile: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user from request', () => {
      const mockReq = {
        user: { id: 'user123', name: 'John Doe' },
      };

      const result = controller.getProfile(mockReq);

      expect(result).toEqual(mockReq.user);
    });
  });

  describe('updateProfile', () => {
    it('should update and return user', async () => {
      const mockReq = { user: { id: 'user123' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const updateDto: UpdateUserDto = { name: 'New Name' };
      const updatedUser = { id: 'user123', name: 'New Name' };

      mockUserService.updateProfile.mockResolvedValue(updatedUser);

      await controller.updateProfile(mockReq, mockRes, updateDto);

      expect(mockUserService.updateProfile).toHaveBeenCalledWith(
        'user123',
        updateDto,
      );
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw exception on error', async () => {
      const mockReq = { user: { id: 'user123' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const updateDto: UpdateUserDto = { name: 'Error User' };

      mockUserService.updateProfile.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(
        controller.updateProfile(mockReq, mockRes, updateDto),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return message', async () => {
      mockUserService.deleteUser.mockResolvedValue(undefined);

      const result = await controller.deleteUser('user123');

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('user123');
      expect(result).toEqual({ message: 'Deleted successfully!' });
    });

    it('should throw exception on delete error', async () => {
      mockUserService.deleteUser.mockRejectedValue(new Error('Delete failed'));

      await expect(controller.deleteUser('user123')).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
