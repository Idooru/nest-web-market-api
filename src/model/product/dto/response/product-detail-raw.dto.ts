export class ProductDetailRawDto {
  product: Product;
  reviews: Review[];
}

class Product {
  id: string;
  name: string;
  price: number;
  origin: string;
  category: string;
  description: string;
  stock: number;
  imageUrls: string[];
  averageScore: number;
}

class Review {
  id: string;
  title: string;
  content: string;
  starRateScore: number;
  imageUrls: string[];
  videoUrls: string[];
  nickName: string;
}
