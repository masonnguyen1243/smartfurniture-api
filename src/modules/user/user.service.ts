import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '@/modules/user/dto/user.dto';
import { hashPasswordHelper } from '@/helpers/utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    const { name, password, address, phone } = updateUserDto;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await hashPasswordHelper(password);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: name ?? user.name,
        address: address ?? user.address,
        phone: phone ?? user.phone,
        password: hashedPassword ?? user.password,
      },
    });

    const { password: _, ...rest } = updatedUser;

    return {
      success: true,
      message: 'Update profile successfully',
      rest,
    };
  }
}
