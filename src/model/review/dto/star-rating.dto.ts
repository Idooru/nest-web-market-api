import { ReviewDto } from "./review-request.dto";

export class StarRatingDto {
  reviewRequestDto: ReviewDto;
  productId: string;
}
