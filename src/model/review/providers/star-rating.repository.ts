import { Repository } from "typeorm";
import { StarRatingEntity } from "../entities/star-rating.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "../entities/review.entity";

export class StarRatingRepository {
  constructor(
    @InjectRepository(StarRatingEntity)
    private readonly starRatingRepository: Repository<StarRatingEntity>,
  ) {}

  async createStarRatingSample(): Promise<StarRatingEntity> {
    const starRating = this.starRatingRepository.create({});
    return await this.starRatingRepository.save(starRating);
  }

  async increaseStarRatingAndSum(
    starRating: StarRatingEntity,
    userSelectScore: number,
  ): Promise<void> {
    switch (userSelectScore) {
      case 1:
        starRating.onePointCount++;
        starRating.onePointSum += userSelectScore;
        await this.starRatingRepository.save(starRating);
        break;
      case 2:
        starRating.twoPointCount++;
        starRating.twoPointSum += userSelectScore;
        await this.starRatingRepository.save(starRating);
        break;
      case 3:
        starRating.threePointCount++;
        starRating.threePointSum += userSelectScore;
        await this.starRatingRepository.save(starRating);
        break;
      case 4:
        starRating.fourPointCount++;
        starRating.fourPointSum += userSelectScore;
        await this.starRatingRepository.save(starRating);
        break;
      case 5:
        starRating.fivePointCount++;
        starRating.fivePointSum += userSelectScore;
        await this.starRatingRepository.save(starRating);
        break;
    }
  }

  async decreaseStarRatingAndMinus(
    starRating: StarRatingEntity,
    beforeScore: number,
  ): Promise<void> {
    switch (beforeScore) {
      case 1:
        starRating.onePointCount--;
        starRating.onePointSum -= beforeScore;
        await this.starRatingRepository.save(starRating);
        break;
      case 2:
        starRating.twoPointCount--;
        starRating.twoPointSum -= beforeScore;
        await this.starRatingRepository.save(starRating);
        break;
      case 3:
        starRating.threePointCount--;
        starRating.threePointSum -= beforeScore;
        await this.starRatingRepository.save(starRating);
        break;
      case 4:
        starRating.fourPointCount--;
        starRating.fourPointSum -= beforeScore;
        await this.starRatingRepository.save(starRating);
        break;
      case 5:
        starRating.fivePointCount--;
        starRating.fivePointSum -= beforeScore;
        await this.starRatingRepository.save(starRating);
        1;
        break;
    }
  }

  async modifyStarRating(
    starRating: StarRatingEntity,
    userSelectScore: number,
    review: ReviewEntity,
  ) {
    const beforeScore = review.userSelectScore;
    if (beforeScore === userSelectScore) return;

    await this.decreaseStarRatingAndMinus(starRating, beforeScore);
    await this.increaseStarRatingAndSum(starRating, userSelectScore);
  }

  async findStarRatingWithId(starRatingId: string): Promise<StarRatingEntity> {
    return await this.starRatingRepository
      .createQueryBuilder("starRating")
      .where("starRating.id = :id", { id: starRatingId })
      .getOne();
  }

  async insertTotalScoreOnStarRating(
    averageScore: number,
    starRatingId: string,
  ) {
    const starRating = await this.findStarRatingWithId(starRatingId);

    starRating.averageScore = averageScore;
    await this.starRatingRepository.save(starRating);
    // await this.starRatingRepository.update(id, { averageScore });
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
