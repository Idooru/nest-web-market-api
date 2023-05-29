import { HttpStatus, Injectable } from "@nestjs/common";
import { InquiryVerifyRepository } from "../repositories/inquiry-verify.repository";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

@Injectable()
export class InquiryVerifyService extends ErrorHandlerProps {
  constructor(
    private readonly inquiryVerifyRepository: InquiryVerifyRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  async isExistInquiryRequestId(id: string): Promise<void> {
    const result = await this.inquiryVerifyRepository.isExistInquiryRequestId(
      id,
    );

    if (!result) {
      this.methodName = this.isExistInquiryRequestId.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 문의 요청 아이디는 데이터베이스에 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }
}
