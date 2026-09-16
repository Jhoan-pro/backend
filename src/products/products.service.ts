import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  // Inyecta el servicio de Prisma para acceder a la base de datos
  constructor(private readonly prisma: PrismaService) {}

  //Si el usuario propietario (owner) no existe, Prisma lanza el error P2003
  //(violación de clave foránea), que convertimos en un 404.

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data: createProductDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        // P2003: la FK al usuario no existe
        throw new NotFoundException('Owner (user) not found');
      }
      throw error;
    }
  }

  //Devuelve todos los productos registrados.
  findAll() {
    return this.prisma.product.findMany();
  }

  // Busca un producto por su ID.
  // Lanza NotFoundException (404) si no existe.

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  //P2025: el producto a actualizar no existe (404).
  //P2003: el nuevo owner indicado no existe (404).

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // P2025: registro no encontrado para actualizar
          throw new NotFoundException('Product not found');
        }
        if (error.code === 'P2003') {
          // P2003: violación de clave foránea (owner inválido)
          throw new NotFoundException('Owner (user) not found');
        }
      }
      throw error;
    }
  }

  //Elimina un producto por su ID.
  // Lanza NotFoundException (404) si el producto no existe (P2025).

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // P2025: no se encontró el registro a eliminar
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }
}
