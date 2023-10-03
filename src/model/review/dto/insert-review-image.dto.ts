import { ReviewEntity } from "../entities/review.entity";
import { ReviewImageEntity } from "../../media/entities/review-image.entity";

export class InsertReviewImageDto {
  reviewImages: ReviewImageEntity[];
  review: ReviewEntity;
}
