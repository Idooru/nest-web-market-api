import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryErrorHandleLibrary } from "src/common/lib/repository-error-handler.library";
import { Repository } from "typeorm";
import { ReviewEntity } from "../entities/review.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class ReviewVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly repositoryErrorHandler: RepositoryErrorHandleLibrary,
  ) {
    super();
  }

  async isExistReviewId(id: string): Promise<boolean> {
    try {
      const result = await this.reviewRepository.exist({ where: { id } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistReviewId.name;
      this.repositoryErrorHandler.init<ReviewEntity>(
        new ReviewEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
