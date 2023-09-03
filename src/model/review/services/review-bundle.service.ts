import { HttpStatus, Injectable } from "@nestjs/common";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewGeneralRepository } from "../repositories/review-general.repository";
import { IReviewBundleService } from "../interfaces/services/review-bundle-service.interface";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

@Injectable()
export class ReviewBundleService
  extends ErrorHandlerProps
  implements IReviewBundleService
{
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly reviewGeneralRepository: ReviewGeneralRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  checkModifyCount(review: ReviewEntity): void {
    if (review.countForModify === 0) {
      this.methodName = this.checkModifyCount.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 리뷰는 더이상 수정할 수 없습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.UNAUTHORIZED)
        .handle();
    }
  }

  async distinguishOwnReview(
    reviewId: string,
    userId: string,
  ): Promise<ReviewEntity> {
    this.methodName = this.distinguishOwnReview.name;

    const client = await this.userGeneralRepository.findClientUserObjectWithId(
      userId,
    );

    const reviews = await this.reviewGeneralRepository.findAllClientsReviews(
      client.id,
    );

    if (!reviews.length) {
      this.httpExceptionHandlingBuilder
        .setMessage(`고객 사용자의 아이디(${userId})로 작성된 리뷰가 없습니다.`)
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.NOT_FOUND)
        .handle();
    }

    const review = reviews.find((idx) => idx.id === reviewId);

    if (!review) {
      // 만약 리뷰를 하나도 작성하지 않은 사용자가 다른 사용자의 리뷰를 수정하려고 시도할시 아래 예외가 발생한다.
      this.httpExceptionHandlingBuilder
        .setMessage(
          `고객 사용자의 아이디(${client.id})로 작성된 리뷰중에 reviewId(${reviewId})와 같은 리뷰를 찾을 수 없습니다.`,
        )
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.NOT_FOUND)
        .handle();
    }

    return review;
  }
}
