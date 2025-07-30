import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProductService } from '@/modules/products/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from '@/modules/products/dto/product.dto';
import { Public } from '@/decorators/customize';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @Public()
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    const page = parseInt(current) || 1;
    const size = parseInt(pageSize) || 10;
    return this.productService.findAll(page, size);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
