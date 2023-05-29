import { HttpStatus, Injectable } from "@nestjs/common";
import { ReviewVerifyRepository } from "../repositories/review-verify.repository";
import { IReviewVerifyService } from "../interfaces/services/review-verify-service.interface";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

@Injectable()
export class ReviewVerifyService
  extends ErrorHandlerProps
  implements IReviewVerifyService
{
  constructor(
    private readonly reviewVerifyRepository: ReviewVerifyRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  async isExistReviewId(id: string): Promise<void> {
    const result = await this.reviewVerifyRepository.isExistReviewId(id);

    if (!result) {
      this.methodName = this.isExistReviewId.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 리뷰 아이디는 데이터베이스에 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }
}
