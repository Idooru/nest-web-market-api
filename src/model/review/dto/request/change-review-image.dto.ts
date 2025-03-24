import { ReviewImageEntity } from "../../../media/entities/review-image.entity";

export class ChangeReviewImageDto {
  public reviewId: string;
  public beforeReviewImages: ReviewImageEntity[];
  public newReviewImages: ReviewImageEntity[];
}
