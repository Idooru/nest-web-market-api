export class OrderBasicRawDto {
  order: Order;
  payment: Payment[];
}

class Order {
  id: string;
  deliveryOption: string;
  deliveryAddress: string;
  totalPrice: number;
  transactionStatus: string;
  surtaxPrice: number;
}

class Payment {
  id: string;
  quantity: number;
  totalPrice: number;
  product: Product;
}

class Product {
  id: string;
  name: string;
  price: number;
  category: string;
}
