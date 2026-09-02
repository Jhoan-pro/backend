export class OrderItemEntity {
  id!: number;
  productId!: number | null;
  name!: string;
  quantity!: number;
  price!: number;
}

export class OrderEntity {
  id!: number;
  invoiceNumber!: string;
  date!: Date;
  customerName!: string;
  customerEmail!: string;
  customerPhone!: string;
  customerAddress!: string;
  customerCity!: string;
  customerDocumentId!: string;
  notes!: string | null;
  cashierId!: number;
  paymentMethod!: string;
  total!: number;
  items!: OrderItemEntity[];
}