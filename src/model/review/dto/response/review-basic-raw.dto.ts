export class ReviewBasicRawDto {
  review: Review;
  product: Product;
}

class Review {
  id: string;
  title: string;
  createdAt: string;
  starRateScore: number;
  countForModify: number;
}

class Product {
  id: string;
  name: string;
  price: number;
  category: string;
}
