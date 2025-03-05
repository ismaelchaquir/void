import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from '@prisma/client';
import { CreateCompositeProductDto } from './dto/composite.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
      },
    });
  }

  async getProductById(id: string): Promise<Product> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
      },
    });
  }

  // async deleteProduct(id: string): Promise<void> {
  //   await this.prisma.component.updateMany({
  //     where: {
  //       productId: id, // Use the actual productId field in the where clause
  //     },
  //     data: {
  //       product: {
  //         disconnect: true, // Disconnect the product relation
  //       },
  //     },
  //   });

  //   // Now, delete the product
  //   await this.prisma.product.delete({
  //     where: { id },
  //   });
  // }

  async deleteProduct(productId: string) {
    // Check if the product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        components: true,
        products: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if the product is a component of any other product
    const isComponentOfOtherProducts = await this.prisma.component.count({
      where: { componentId: productId },
    });

    if (isComponentOfOtherProducts > 0) {
      throw new BadRequestException(
        'Cannot delete product that is a component of other products',
      );
    }

    // Delete associated components first
    await this.prisma.component.deleteMany({
      where: { productId },
    });

    // Delete the product
    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  // Create Composite Product
  async createCompositeProduct(dto: CreateCompositeProductDto) {
    const productPrice = await this.calculateCompositeProductPrice(
      dto.components,
    );
    const productQuantity = await this.calculateCompositeProductStock(
      dto.components,
    );

    const compositeProduct = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: productPrice,
        quantity: productQuantity,
        components: {
          create: dto.components.map((component) => ({
            component: { connect: { id: component.productId } }, // Correct way to connect the product entity
            quantity: component.quantity,
          })),
        },
      },
    });

    return {
      ...compositeProduct,
      components: dto.components,
    };
  }

  // Get Composite Product by ID
  async getCompositeProduct(id: string): Promise<Product> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        components: {
          include: {
            component: true,
          },
        },
      },
    });
  }

  async getCompositeProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        components: {
          some: {}, // This ensures only products with components are returned
        },
      },
      include: {
        components: {
          include: {
            component: true,
          },
        },
      },
    });
  }

  async deleteCompositeProduct(productId: string) {
    // Check if the product exists and is a composite product
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { components: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if this product is a component of any other product
    const isComponentOfOtherProducts = await this.prisma.component.count({
      where: { componentId: productId },
    });

    if (isComponentOfOtherProducts > 0) {
      throw new BadRequestException(
        'Cannot delete composite product that is a component of other products',
      );
    }

    // Delete components of this composite product
    await this.prisma.component.deleteMany({
      where: { productId },
    });

    // Delete the composite product
    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  // Calculate Composite Product Price
  private async calculateCompositeProductPrice(
    components: { productId: string; quantity: number }[],
  ): Promise<number> {
    let totalPrice = 0;

    for (const component of components) {
      const product = await this.prisma.product.findUnique({
        where: { id: component.productId },
      });
      if (product) {
        totalPrice += Number(product.price) * component.quantity;
      }
    }

    return totalPrice;
  }

  // Calculate Composite Product Stock
  private async calculateCompositeProductStock(
    components: { productId: string; quantity: number }[],
  ): Promise<number> {
    let minStock = Infinity;

    for (const component of components) {
      const product = await this.prisma.product.findUnique({
        where: { id: component.productId },
      });
      if (product) {
        const availableStock = Math.floor(
          Number(product.quantity) / component.quantity,
        );
        minStock = Math.min(minStock, availableStock);
      }
    }

    return minStock;
  }
}
