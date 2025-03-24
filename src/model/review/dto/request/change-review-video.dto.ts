import { ReviewVideoEntity } from "../../../media/entities/review-video.entity";

export class ChangeReviewVideoDto {
  public beforeReviewVideos: ReviewVideoEntity[];
  public newReviewVideos: ReviewVideoEntity[];
  public reviewId: string;
}
