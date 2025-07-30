import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { contains } from 'class-validator';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  async findAll(current: number, pageSize: number) {
    const limit = pageSize || 10;
    const page = current || 1;
    const skip = (page - 1) * limit;

    const totalItems = await this.prisma.product.count();
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.prisma.product.findMany({
      skip,
      take: limit,
      include: {
        category: { select: { name: true } },
      },
    });

    return {
      data: result,
      currentPage: page,
      totalPages,
      totalItems,
    };
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { ...updateProductDto },
      include: {
        category: { select: { name: true } },
      },
    });

    return {
      updatedProduct,
      success: true,
      message: 'Update product successfully',
    };
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({ where: { id } });

    return { message: 'Delete successfully' };
  }
}
