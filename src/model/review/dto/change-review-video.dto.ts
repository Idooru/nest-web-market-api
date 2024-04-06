import { ReviewVideoEntity } from "../../media/entities/review-video.entity";
import { ReviewEntity } from "../entities/review.entity";

export class ChangeReviewVideoDto {
  public beforeReviewVideos: ReviewVideoEntity[];
  public newReviewVideos: ReviewVideoEntity[];
  public review: ReviewEntity;
}
