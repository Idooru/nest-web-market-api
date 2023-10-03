import { ReviewEntity } from "../entities/review.entity";
import { ReviewVideoEntity } from "../../media/entities/review-video.entity";

export class InsertReviewVideoDto {
  reviewVideos: ReviewVideoEntity[];
  review: ReviewEntity;
}
