import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear producto
  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: createProductDto,
    });
  }

  // Obtener todos los productos
  async findAll() {
    return await this.prisma.product.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Obtener un producto por ID
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  // Actualizar producto
  async update(id: number, updateProductDto: UpdateProductDto) {
    // Verificamos que exista
    await this.findOne(id);

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  // Eliminar producto
  async remove(id: number) {
    // Verificamos que exista
    await this.findOne(id);

    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
