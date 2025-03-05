import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiBearerAuth('authorization')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
@ApiTags('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  public async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto);
  }

  @Get('/:id')
  public async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Delete('/:id')
  public async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @Patch('/:id')
  public async updateProduct(
    @Param('id') id: string,
    @Body() dto: CreateProductDto,
  ) {
    return await this.productService.updateProduct(id, dto);
  }
}
