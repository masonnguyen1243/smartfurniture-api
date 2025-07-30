import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoriesDto } from '@/modules/categories/dto/categories.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.product.create({ data });
  }

  findAll() {
    return this.prisma.product.findMany();
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
