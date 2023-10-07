import { StarRateEntity } from "../entities/star-rate.entity";

export class StarRatingDto {
  scoreChosenByClient: 1 | 2 | 3 | 4 | 5;
  starRate: StarRateEntity;
}
