import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { StarRateEntity } from "../entities/star-rate.entity";
import { Transactional } from "../../../common/interfaces/initializer/transactional";
import { ReviewRepositoryPayload } from "../logic/transaction/review-repository.payload";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { StarRateScore } from "../types/star-rate-score.type";
import { CreateReviewRowDto } from "../dto/request/create-review.dto";
import { InsertReviewImageDto } from "../dto/request/insert-review-image.dto";
import { InsertReviewVideoDto } from "../dto/request/insert-review-video.dto";
import { ModifyReviewRowDto } from "../dto/request/modify-review.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ReviewUpdateRepository {
  constructor(private readonly transaction: Transactional<ReviewRepositoryPayload>) {}

  @Transaction
  public async createReview(dto: CreateReviewRowDto): Promise<ReviewEntity> {
    const { body, reviewerId, productId } = dto;
    const reviewId = uuidv4();

    await this.transaction.getRepository().review.query(
      `INSERT INTO
       reviews (id, title, content, clientUserId, productId)
       VALUES(?, ?, ?, ?, ?)`,
      [reviewId, body.title, body.content, reviewerId, productId],
    );

    const insertedReview = await this.transaction
      .getRepository()
      .review.query(`SELECT * FROM reviews WHERE id = ?`, [reviewId]);

    return insertedReview[0]; // 삽입된 엔티티 반환
  }

  @Transaction
  public async insertReviewIdOnReviewImage({ reviewImageId, reviewId }: InsertReviewImageDto): Promise<void> {
    await this.transaction.getRepository().reviewImage.query(
      `UPDATE reviews_images 
       SET reviewId = ?
       WHERE id = ?`,
      [reviewId, reviewImageId],
    );
  }

  @Transaction
  public async insertReviewIdOnReviewVideo({ reviewVideoId, reviewId }: InsertReviewVideoDto): Promise<void> {
    await this.transaction.getRepository().reviewVideo.query(
      `UPDATE reviews_videos 
       SET reviewId = ?
       WHERE id = ?`,
      [reviewId, reviewVideoId],
    );
  }

  @Transaction
  public async increaseStarRate(starRateScore: StarRateScore, starRate: StarRateEntity): Promise<void> {
    switch (starRateScore) {
      case 1:
        ++starRate.onePointCount;
        starRate.onePointSum += starRateScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 2:
        ++starRate.twoPointCount;
        starRate.twoPointSum += starRateScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 3:
        ++starRate.threePointCount;
        starRate.threePointSum += starRateScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 4:
        ++starRate.fourPointCount;
        starRate.fourPointSum += starRateScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
      case 5:
        ++starRate.fivePointCount;
        starRate.fivePointSum += starRateScore;
        await this.transaction.getRepository().starRate.save(starRate);
        break;
    }
  }

  @Transaction
  public async modifyReview(dto: ModifyReviewRowDto): Promise<void> {
    const { review, body } = dto;

    await this.transaction.getRepository().review.update(review.id, {
      ...body,
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
  public async decreaseStarRate(starRate: StarRateEntity, beforeScore: number): Promise<void> {
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
