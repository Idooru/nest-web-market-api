import { Repository } from "typeorm";
import { RatingEntity } from "./../entities/rating.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class RatingReposiotry {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
  ) {}

  async createRating(): Promise<RatingEntity> {
    return await this.ratingRepository.save({});
  }

  async ratingIncreaseAndSum(
    rating: RatingEntity,
    score: number,
  ): Promise<void> {
    switch (score) {
      case 1:
        rating.onePointCount++;
        rating.onePointSum += score;
        await this.ratingRepository.save(rating);
        break;
      case 2:
        rating.twoPointCount++;
        rating.twoPointSum += score;
        await this.ratingRepository.save(rating);
        break;
      case 3:
        rating.threePointCount++;
        rating.threePointSum += score;
        await this.ratingRepository.save(rating);
        break;
      case 4:
        rating.fourPointCount++;
        rating.fourPointSum += score;
        await this.ratingRepository.save(rating);
        break;
      case 5:
        rating.fivePointCount++;
        rating.fivePointSum += score;
        await this.ratingRepository.save(rating);
        break;
    }
  }
}
