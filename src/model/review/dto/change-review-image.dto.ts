import { ReviewImageEntity } from "../../media/entities/review-image.entity";
import { ReviewEntity } from "../entities/review.entity";

export class ChangeReviewImageDto {
  beforeReviewImages: ReviewImageEntity[];
  newReviewImages: ReviewImageEntity[];
  review: ReviewEntity;
}
