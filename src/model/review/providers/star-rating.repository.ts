import { Repository } from "typeorm";
import { StarRatingEntity } from "../entities/star-rating.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class StarRatingRepository {
  constructor(
    @InjectRepository(StarRatingEntity)
    private readonly starRatingRepository: Repository<StarRatingEntity>,
  ) {}

  async createRating(): Promise<StarRatingEntity> {
    return await this.starRatingRepository.save({});
  }

  async starRatingIncreaseAndSum(
    starRating: StarRatingEntity,
    score: number,
  ): Promise<void> {
    switch (score) {
      case 1:
        starRating.onePointCount++;
        starRating.onePointSum += score;
        await this.starRatingRepository.save(starRating);
        break;
      case 2:
        starRating.twoPointCount++;
        starRating.twoPointSum += score;
        await this.starRatingRepository.save(starRating);
        break;
      case 3:
        starRating.threePointCount++;
        starRating.threePointSum += score;
        await this.starRatingRepository.save(starRating);
        break;
      case 4:
        starRating.fourPointCount++;
        starRating.fourPointSum += score;
        await this.starRatingRepository.save(starRating);
        break;
      case 5:
        starRating.fivePointCount++;
        starRating.fivePointSum += score;
        await this.starRatingRepository.save(starRating);
        break;
    }
  }

  async findStarRatingWithId(starRatingId: string) {
    return await this.starRatingRepository
      .createQueryBuilder("starRating")
      .where("starRating.id = :id", { id: starRatingId })
      .getOne();
  }
}
