import { ModifyStarRateDto } from "../../dto/modify-star-rate.dto";
import { StarRatingDto } from "../../dto/star-rating.dto";
import { ReviewEntity } from "../../entities/review.entity";
import { StarRateEntity } from "../../entities/star-rate.entity";

export interface IStarRateGeneralService {
  starRating(starRatingDto: StarRatingDto): Promise<void>;
  modifyStarRate(modifyStarRate: ModifyStarRateDto): Promise<void>;
  decreaseStarRate(review: ReviewEntity): Promise<void>;
  calculateStarRate(starRate: StarRateEntity): Promise<void>;
}
