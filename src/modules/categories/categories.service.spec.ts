import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.categories.create({ data });
  }

  findAll() {
    return this.prisma.categories.findMany();
  }

  findOne(id: string) {
    return this.prisma.categories.findUnique({ where: { id } });
  }

  update(id: string, data: any) {
    return this.prisma.categories.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.categories.delete({ where: { id } });
  }
}

