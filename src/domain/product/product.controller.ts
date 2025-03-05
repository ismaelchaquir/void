import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActionPermission, Product, ResourcePermission } from '@prisma/client';
import { CreateCompositeProductDto } from './dto/composite.dto';
import { Permissions } from '@/common/decorators/permission.decorator';
import { AclGuard } from '@/common/guards/acl.guard';
import { GetCurrentUser } from '@/common/decorators/get-current-user.decorator';

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

  @Post('simple')
  @UseGuards(AclGuard)
  @Permissions([
    {
      resource: ResourcePermission.products,
      actions: [ActionPermission.create],
    },
  ])
  public async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto);
  }

  @Get('simple/:id')
  @UseGuards(AclGuard)
  @Permissions([
    {
      resource: ResourcePermission.products,
      actions: [ActionPermission.read],
    },
  ])
  public async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Get('simple')
  @UseGuards(AclGuard)
  @Permissions([
    {
      resource: ResourcePermission.products,
      actions: [ActionPermission.read],
    },
  ])
  public async getProducts() {
    return await this.productService.getProducts();
  }

  @Delete('simple/:id')
  @UseGuards(AclGuard)
  @Permissions([
    {
      resource: ResourcePermission.products,
      actions: [ActionPermission.delete],
    },
  ])
  public async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @Patch('simple/:id')
  @UseGuards(AclGuard)
  @Permissions([
    {
      resource: ResourcePermission.products,
      actions: [ActionPermission.update],
    },
  ])
  public async updateProduct(
    @Param('id') id: string,
    @Body() dto: CreateProductDto,
  ) {
    return await this.productService.updateProduct(id, dto);
  }

  // Create a composite product
  @Post('composite')
  @UseGuards(AclGuard)
  @Permissions([
    {
      resource: ResourcePermission.products,
      actions: [ActionPermission.delete],
    },
  ])
  async createCompositeProduct(
    @Body()
    dto: CreateCompositeProductDto,
    @GetCurrentUser() user: any,
  ): Promise<Product> {
    return this.productService.createCompositeProduct(dto);
  }

  @Get('composite')
  @UseGuards(AclGuard)
  @Permissions([
    {
      resource: ResourcePermission.products,
      actions: [ActionPermission.delete],
    },
  ])
  public async getCompositeProducts() {
    return await this.productService.getCompositeProducts();
  }

  // Get a composite product by ID
  @Get('composite/:id')
  @UseGuards(AclGuard)
  @Permissions([
    {
      resource: ResourcePermission.products,
      actions: [ActionPermission.read],
    },
  ])
  async getCompositeProduct(@Param('id') id: string): Promise<Product> {
    return this.productService.getCompositeProduct(id);
  }

  @Delete('composite/:id')
  @UseGuards(AclGuard)
  @Permissions([
    {
      resource: ResourcePermission.products,
      actions: [ActionPermission.delete],
    },
  ])
  public async deleteCompositeProduct(@Param('id') id: string) {
    return await this.productService.deleteCompositeProduct(id);
  }
}
