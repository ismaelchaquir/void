import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  ComponentDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const components = dto.components?.map((component) => ({
      productId: component.productId,
      quantity: component.quantity,
      component: {
        connect: { id: component.productId },
      },
    }));

    const price = components
      ? await this.calculateCompositePrice(components)
      : dto.price;

    const quantity = components
      ? await this.calculateCompositeQuantity(components)
      : dto.quantity;

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price,
        quantity,
        components: {
          create: components,
        },
      },
    });
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const components = dto.components?.map((component) => ({
      productId: component.productId,
      quantity: component.quantity,
      component: {
        connect: { id: component.productId },
      },
    }));

    const price = components
      ? await this.calculateCompositePrice(components)
      : dto.price;

    const quantity = components
      ? await this.calculateCompositeQuantity(components)
      : dto.quantity;

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price,
        quantity,
        components: {
          deleteMany: {},
          create: components,
        },
      },
    });
  }

  private async calculateCompositePrice(
    components: ComponentDto[],
  ): Promise<number> {
    const prices = await Promise.all(
      components.map(async (component) => {
        const product = await this.prisma.product.findUnique({
          where: { id: component.productId },
        });
        return (product.price as any) * component.quantity;
      }),
    );
    return prices.reduce((acc, price) => acc + price, 0);
  }

  private async calculateCompositeQuantity(
    components: ComponentDto[],
  ): Promise<number> {
    const quantities = await Promise.all(
      components.map(async (component) => {
        const product = await this.prisma.product.findUnique({
          where: { id: component.productId },
        });
        return Math.floor((product.quantity as any) / component.quantity);
      }),
    );
    return Math.min(...quantities);
  }
}
