import { ReviewEntity } from "../../review/entities/review.entity";
import { StarRateEntity } from "../../review/entities/star-rate.entity";

export class SearchDeleteReviewDto {
  review: ReviewEntity;
  starRate: StarRateEntity;
}
