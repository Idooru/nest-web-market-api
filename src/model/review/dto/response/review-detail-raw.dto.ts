export class ReviewDetailRawDto {
  review: Review;
  product: Product;
}

class Review {
  id: string;
  title: string;
  content: string;
  starRateScore: number;
  countForModify: number;
  imageUrls: string[];
  videoUrls: string[];
}

class Product {
  id: string;
  name: string;
  price: number;
  category: string;
}
