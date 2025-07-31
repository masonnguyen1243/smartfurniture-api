import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { CategoriesDto } from '@/modules/categories/dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(categoriesDto: CategoriesDto) {
    return this.prisma.categories.create({ data: categoriesDto });
  }

  findAll() {
    return this.prisma.categories.findMany();
  }

  findOne(id: string) {
    return this.prisma.categories.findUnique({ where: { id } });
  }

  update(id: string, categoriesDto: CategoriesDto) {
    return this.prisma.categories.update({
      where: { id },
      data: categoriesDto,
    });
  }

  remove(id: string) {
    return this.prisma.categories.delete({ where: { id } });
  }
}
