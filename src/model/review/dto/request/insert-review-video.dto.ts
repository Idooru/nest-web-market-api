import { ReviewVideoEntity } from "../../../media/entities/review-video.entity";

export class InsertReviewVideosDto {
  reviewId: string;
  reviewVideos: ReviewVideoEntity[];
}

export class InsertReviewVideoDto {
  reviewId: string;
  reviewVideoId: string;
}
