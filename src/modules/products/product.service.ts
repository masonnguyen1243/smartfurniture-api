import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './dto/product.dto';
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
        category: true,
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

  update(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
