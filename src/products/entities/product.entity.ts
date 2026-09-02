export class ProductEntity {
  id!: number;
  ownerId!: number | null;
  name!: string;
  price!: number;
  stock!: number;
  category!: string;
  description!: string;
  image!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}