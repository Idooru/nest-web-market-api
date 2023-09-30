import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import {
  ReviewRepositoryPayload,
  ReviewRepositoryVO,
} from "./review-repository.vo";
import { ReviewEntity } from "../../entities/review.entity";
import { StarRateEntity } from "../../entities/star-rate.entity";
import { ReviewImageEntity } from "../../../media/entities/review-image.entity";
import { ReviewVideoEntity } from "../../../media/entities/review-video.entity";

@Injectable()
export class ReviewQueryRunnerProvider {
  constructor(
    private readonly dataSourece: DataSource,
    private readonly reviewRepositoryVO: ReviewRepositoryVO,
  ) {}

  async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSourece.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const repositoryPayload: ReviewRepositoryPayload = {
      reviewRepository: queryRunner.manager.getRepository(ReviewEntity),
      starRateRepository: queryRunner.manager.getRepository(StarRateEntity),
      reviewImageRepository:
        queryRunner.manager.getRepository(ReviewImageEntity),
      reviewVideoRepository:
        queryRunner.manager.getRepository(ReviewVideoEntity),
    };

    this.reviewRepositoryVO.setRepositoryPayload(repositoryPayload);

    return queryRunner;
  }
}
