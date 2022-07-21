import { Repository } from "typeorm";
import { StarRatingEntity } from "../entities/star-rating.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/model/product/entities/product.entity";

export class StarRatingRepository {
  constructor(
    @InjectRepository(StarRatingEntity)
    private readonly starRatingRepository: Repository<StarRatingEntity>,
  ) {}

  async createStarRatingSample(): Promise<StarRatingEntity> {
    const starRating = this.starRatingRepository.create({});
    return await this.starRatingRepository.save(starRating);
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

  async findStarRatingWithId(starRatingId: string): Promise<StarRatingEntity> {
    return await this.starRatingRepository
      .createQueryBuilder("starRating")
      .where("starRating.id = :id", { id: starRatingId })
      .getOne();
  }

  async insertTotalScoreOnStarRating(averageScore: number, id: string) {
    await this.starRatingRepository.update(id, { averageScore });
  }

  async insertStarRatingOnProduct(id: string, product: ProductEntity) {
    const starRating = await this.starRatingRepository
      .createQueryBuilder("starRating")
      .where("starRating.id = :id", { id })
      .getOne();

    starRating.Product = product;
    await this.starRatingRepository.save(starRating);
  }
}
