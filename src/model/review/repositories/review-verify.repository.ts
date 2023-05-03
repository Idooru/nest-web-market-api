import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityTarget, Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder.builder";

@Injectable()
export class ReviewVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder,
  ) {
    super();
  }

  async isExistReviewId(id: string): Promise<boolean> {
    try {
      const result = await this.reviewRepository.exist({ where: { id } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistReviewId.name;
      this.errorHandlerBuilder
        .setEntity(ReviewEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
