import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import { ReviewRepositoryPayload } from "./review-repository.payload";
import { ReviewEntity } from "../../entities/review.entity";
import { StarRateEntity } from "../../entities/star-rate.entity";
import { ReviewImageEntity } from "../../../media/entities/review-image.entity";
import { ReviewVideoEntity } from "../../../media/entities/review-video.entity";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";

@Injectable()
export class ReviewQueryRunnerProvider extends Transactional<ReviewRepositoryPayload> {
  private payload: ReviewRepositoryPayload;

  constructor(private readonly dataSourece: DataSource) {
    super();
  }

  public async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSourece.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.payload = {
      review: queryRunner.manager.getRepository(ReviewEntity),
      starRate: queryRunner.manager.getRepository(StarRateEntity),
      reviewImage: queryRunner.manager.getRepository(ReviewImageEntity),
      reviewVideo: queryRunner.manager.getRepository(ReviewVideoEntity),
    };

    return queryRunner;
  }

  public getRepository(): ReviewRepositoryPayload {
    return this.payload;
  }
}
