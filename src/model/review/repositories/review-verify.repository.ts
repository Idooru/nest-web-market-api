import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { TypeOrmErrorHandlingBuilder } from "src/common/lib/error-handler/typeorm-error-handling.builder";
import { ReviewErrorHandler } from "../error/review-error.handler";
import { IReviewVerifyRepository } from "../interfaces/repositories/review-verify-repository.interface";

@Injectable()
export class ReviewVerifyRepository
  extends ErrorHandlerProps
  implements IReviewVerifyRepository
{
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlingBuilder,
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
        .setErrorHandler(ReviewErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
