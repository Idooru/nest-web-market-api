import { ReviewEntity } from "../../entities/review.entity";
import { StarRateEntity } from "../../entities/star-rate.entity";

export class SearchDeleteReviewDto {
  review: ReviewEntity;
  starRate: StarRateEntity;
}
