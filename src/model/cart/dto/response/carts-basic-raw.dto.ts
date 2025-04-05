export class CartsBasicRawDto {
  cart: Cart;
  product: Product;
}

class Cart {
  id: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

class Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrls: string[];
}
