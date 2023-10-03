import { ReviewVideoEntity } from "../../media/entities/review-video.entity";
import { ReviewEntity } from "../entities/review.entity";

export class ChangeReviewVideoDto {
  beforeReviewVideos: ReviewVideoEntity[];
  newReviewVideos: ReviewVideoEntity[];
  review: ReviewEntity;
}
