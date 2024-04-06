import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewImageEntity } from "../../media/entities/review-image.entity";
import { ReviewVideoEntity } from "../../media/entities/review-video.entity";
import { StarRateEntity } from "../entities/star-rate.entity";
import { CreateReviewDto } from "../dto/create-review.dto";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { Transactional } from "../../../common/interfaces/initializer/transactional";
import { ReviewRepositoryPayload } from "../logic/transaction/review-repository.payload";
import { Transaction } from "../../../common/decorators/transaction.decorator";

@Injectable()
export class ReviewUpdateRepository {
  constructor(
    private readonly transaction: Transactional<ReviewRepositoryPayload>,
  ) {}

  @Transaction
  public createReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const { reviewBodyDto, product, clientUser } = createReviewDto;

    return this.transaction.getRepository().review.save({
      ...reviewBodyDto,
      Product: product,
      reviewer: clientUser,
    });
  }

  @Transaction
  public async insertReviewIdOnReviewImage(
    reviewImage: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void> {
    reviewImage.Review = review;
    await this.transaction.getRepository().reviewImage.save(reviewImage);
  }

  @Transaction
  public async insertReviewIdOnReviewVideo(
    reviewVideo: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void> {
    reviewVideo.Review = review;
    await this.transaction.getRepository().reviewVideo.save(reviewVideo);
  }

  @Transaction
  public async increaseStarRate(
    scoreChosenByClient: 1 | 2 | 3 | 4 | 5,
    starRate: StarRateEntity,
  ): Promise<void> {
    switch (scoreChosenByClient) {
      case 1:
        ++starRate.onePointCount;
        starRate.onePointSum += scoreChosenByClient;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 2:
        ++starRate.twoPointCount;
        starRate.twoPointSum += scoreChosenByClient;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 3:
        ++starRate.threePointCount;
        starRate.threePointSum += scoreChosenByClient;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 4:
        ++starRate.fourPointCount;
        starRate.fourPointSum += scoreChosenByClient;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 5:
        ++starRate.fivePointCount;
        starRate.fivePointSum += scoreChosenByClient;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
    }
  }

  @Transaction
  public async modifyReview(modifyReviewDto: ModifyReviewDto): Promise<void> {
    const { review, reviewBodyDto } = modifyReviewDto;

    await this.transaction.getRepository().review.update(review.id, {
      ...reviewBodyDto,
      countForModify: --review.countForModify,
    });
  }

  @Transaction
  public async deleteReviewImageWithId(id: string): Promise<void> {
    await this.transaction.getRepository().reviewImage.delete({ id });
  }

  @Transaction
  public async deleteReviewVideoWithId(id: string): Promise<void> {
    await this.transaction.getRepository().reviewVideo.delete({ id });
  }

  @Transaction
  public async deleteReviewWithId(id: string): Promise<void> {
    await this.transaction.getRepository().review.delete({ id });
  }

  @Transaction
  public async decreaseStarRate(
    starRate: StarRateEntity,
    beforeScore: number,
  ): Promise<void> {
    switch (beforeScore) {
      case 1:
        --starRate.onePointCount;
        starRate.onePointSum -= beforeScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 2:
        --starRate.twoPointCount;
        starRate.twoPointSum -= beforeScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 3:
        --starRate.threePointCount;
        starRate.threePointSum -= beforeScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 4:
        --starRate.fourPointCount;
        starRate.fourPointSum -= beforeScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 5:
        --starRate.fivePointCount;
        starRate.fivePointSum -= beforeScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
    }
  }

  @Transaction
  public async renewAverage(starRate: StarRateEntity): Promise<void> {
    const { id } = starRate;
    await this.transaction.getRepository().starRate.update(id, starRate);
  }
}
