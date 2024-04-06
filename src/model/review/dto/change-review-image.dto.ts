import { ReviewImageEntity } from "../../media/entities/review-image.entity";
import { ReviewEntity } from "../entities/review.entity";

export class ChangeReviewImageDto {
  public beforeReviewImages: ReviewImageEntity[];
  public newReviewImages: ReviewImageEntity[];
  public review: ReviewEntity;
}
