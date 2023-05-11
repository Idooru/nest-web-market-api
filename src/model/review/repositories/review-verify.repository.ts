import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { TypeOrmErrorHandlerBuilder } from "src/common/lib/error-handler/typeorm-error-handler.builder";
import { ReviewErrorCase } from "../error/review-error.case";

@Injectable()
export class ReviewVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlerBuilder,
  ) {
    super();
  }

  async isExistReviewId(id: string): Promise<boolean> {
    try {
      const result = await this.reviewRepository.exist({ where: { id } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistReviewId.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ReviewErrorCase)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
