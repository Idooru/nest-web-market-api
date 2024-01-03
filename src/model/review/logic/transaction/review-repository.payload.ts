import { ReviewEntity } from "../../entities/review.entity";
import { Repository } from "typeorm";
import { StarRateEntity } from "../../entities/star-rate.entity";
import { ReviewImageEntity } from "../../../media/entities/review-image.entity";
import { ReviewVideoEntity } from "../../../media/entities/review-video.entity";

export interface ReviewRepositoryPayload {
  review: Repository<ReviewEntity>;
  starRate: Repository<StarRateEntity>;
  reviewImage: Repository<ReviewImageEntity>;
  reviewVideo: Repository<ReviewVideoEntity>;
}
