import { ReviewBodyDto } from "./review-body.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewImageEntity } from "../../media/entities/review-image.entity";
import { ReviewVideoEntity } from "../../media/entities/review-video.entity";
import { StarRateEntity } from "../entities/star-rate.entity";

export class SearchModifyReviewDto {
  reviewBodyDto: ReviewBodyDto;
  review: ReviewEntity;
  beforeReviewImages: ReviewImageEntity[];
  newReviewImages: ReviewImageEntity[];
  beforeReviewVideos: ReviewVideoEntity[];
  newReviewVideos: ReviewVideoEntity[];
  starRate: StarRateEntity;
}
