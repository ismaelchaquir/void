import { Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  public async createProduct(dto: CreateProductDto) {
    return await this.productService.createProduct(dto);
  }

  @Get('/:id')
  public async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Get('/:id')
  public async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @Post('/:id')
  public async updateProduct(@Param('id') id: string, dto: CreateProductDto) {
    return await this.productService.updateProduct(id, dto);
  }
}
