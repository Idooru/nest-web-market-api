import { ReviewEntity } from "../entities/review.entity";
import { StarRatingDto } from "./star-rating.dto";

export class ModifyStarRateDto extends StarRatingDto {
  review: ReviewEntity;
}
