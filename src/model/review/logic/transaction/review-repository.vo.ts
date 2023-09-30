import { ReviewEntity } from "../../entities/review.entity";
import { Repository } from "typeorm";
import { StarRateEntity } from "../../entities/star-rate.entity";
import { ReviewImageEntity } from "../../../media/entities/review-image.entity";
import { ReviewVideoEntity } from "../../../media/entities/review-video.entity";

export interface ReviewRepositoryPayload {
  reviewRepository: Repository<ReviewEntity>;
  starRateRepository: Repository<StarRateEntity>;
  reviewImageRepository: Repository<ReviewImageEntity>;
  reviewVideoRepository: Repository<ReviewVideoEntity>;
}

export class ReviewRepositoryVO {
  private _reviewRepository: Repository<ReviewEntity>;
  private _starRateRepository: Repository<StarRateEntity>;
  private _reviewImageRepository: Repository<ReviewImageEntity>;
  private _reviewVideoRepository: Repository<ReviewVideoEntity>;

  public setRepositoryPayload(
    repositoryPayload: ReviewRepositoryPayload,
  ): void {
    const {
      reviewRepository,
      starRateRepository,
      reviewImageRepository,
      reviewVideoRepository,
    } = repositoryPayload;

    this.reviewRepository = reviewRepository;
    this.starRateRepository = starRateRepository;
    this.reviewImageRepository = reviewImageRepository;
    this.reviewVideoRepository = reviewVideoRepository;
  }

  get reviewRepository(): Repository<ReviewEntity> {
    return this._reviewRepository;
  }

  set reviewRepository(value: Repository<ReviewEntity>) {
    this._reviewRepository = value;
  }

  get starRateRepository(): Repository<StarRateEntity> {
    return this._starRateRepository;
  }

  set starRateRepository(value: Repository<StarRateEntity>) {
    this._starRateRepository = value;
  }

  get reviewImageRepository(): Repository<ReviewImageEntity> {
    return this._reviewImageRepository;
  }

  set reviewImageRepository(value: Repository<ReviewImageEntity>) {
    this._reviewImageRepository = value;
  }

  get reviewVideoRepository(): Repository<ReviewVideoEntity> {
    return this._reviewVideoRepository;
  }

  set reviewVideoRepository(value: Repository<ReviewVideoEntity>) {
    this._reviewVideoRepository = value;
  }
}
