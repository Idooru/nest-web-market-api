export class ProductDetailRawDto {
  productId: string;
  productName: string;
  productPrice: number;
  productOrigin: string;
  productCategory: string;
  productDescription: string;
  productStock: number;
  productImageUrls: string[];
  averageScore: number;
  reviews: ReviewOnProductDetailRaw[];
}

class ReviewOnProductDetailRaw {
  reviewId: string;
  reviewTitle: string;
  reviewContent: string;
  reviewStarRateScore: number;
  reviewImageUrls: string[];
  reviewVideoUrls: string[];
  reviewerNickName: string;
}
