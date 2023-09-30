import { Injectable } from "@nestjs/common";
import { ReviewRepositoryVO } from "../logic/transaction/review-repository.vo";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { Repository } from "typeorm";
import { ReviewImageEntity } from "../../media/entities/review-image.entity";
import { ReviewVideoEntity } from "../../media/entities/review-video.entity";
import { StarRateEntity } from "../entities/star-rate.entity";
import { CreateReviewDto } from "../dto/create-review.dto";
import { ModifyReviewDto } from "../dto/modify-review.dto";

@Injectable()
export class ReviewOperationRepository {
  constructor(
    private readonly queryRunner: ReviewRepositoryVO,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  // Transaction
  public async createReview(
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    const { reviewBodyDto, product, client } = createReviewDto;

    return await this.queryRunner.reviewRepository.save({
      ...reviewBodyDto,
      Product: product,
      reviewer: client,
    });
  }

  // Transaction
  public async insertReviewIdOnReviewImage(
    reviewImage: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void> {
    reviewImage.Review = review;
    await this.queryRunner.reviewImageRepository.save(reviewImage);
  }

  // Transaction
  public async insertReviewIdOnReviewVideo(
    reviewVideo: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void> {
    reviewVideo.Review = review;
    await this.queryRunner.reviewVideoRepository.save(reviewVideo);
  }

  // Transaction
  public async increaseStarRate(
    scoreChosenByClient: 1 | 2 | 3 | 4 | 5,
    starRate: StarRateEntity,
  ): Promise<void> {
    switch (scoreChosenByClient) {
      case 1:
        ++starRate.onePointCount;
        starRate.onePointSum += scoreChosenByClient;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
      case 2:
        ++starRate.twoPointCount;
        starRate.twoPointSum += scoreChosenByClient;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
      case 3:
        ++starRate.threePointCount;
        starRate.threePointSum += scoreChosenByClient;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
      case 4:
        ++starRate.fourPointCount;
        starRate.fourPointSum += scoreChosenByClient;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
      case 5:
        ++starRate.fivePointCount;
        starRate.fivePointSum += scoreChosenByClient;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
    }
  }

  // Transaction
  public async modifyReview(modifyReviewDto: ModifyReviewDto): Promise<void> {
    const { review, reviewBodyDto } = modifyReviewDto;

    await this.queryRunner.reviewRepository.update(review.id, {
      ...reviewBodyDto,
      countForModify: --review.countForModify,
    });
  }

  // Transaction
  public async deleteReviewImageWithId(id: string): Promise<void> {
    await this.queryRunner.reviewImageRepository.delete({ id });
  }

  // Transaction
  public async deleteReviewVideoWithId(id: string): Promise<void> {
    await this.queryRunner.reviewVideoRepository.delete({ id });
  }

  // Transaction
  public async deleteReviewWithId(id: string): Promise<void> {
    await this.queryRunner.reviewRepository.delete({ id });
  }

  // Transaction
  public async decreaseStarRate(
    starRate: StarRateEntity,
    beforeScore: number,
  ): Promise<void> {
    switch (beforeScore) {
      case 1:
        --starRate.onePointCount;
        starRate.onePointSum -= beforeScore;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
      case 2:
        --starRate.twoPointCount;
        starRate.twoPointSum -= beforeScore;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
      case 3:
        --starRate.threePointCount;
        starRate.threePointSum -= beforeScore;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
      case 4:
        --starRate.fourPointCount;
        starRate.fourPointSum -= beforeScore;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
      case 5:
        --starRate.fivePointCount;
        starRate.fivePointSum -= beforeScore;
        await this.queryRunner.starRateRepository.save(starRate);
        break;
    }
  }

  // Transaction
  public async renewTotalScore(starRate: StarRateEntity): Promise<void> {
    const { id } = starRate;
    await this.queryRunner.starRateRepository.update(id, { ...starRate });
  }
}
