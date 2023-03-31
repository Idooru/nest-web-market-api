import { BadRequestException, Injectable } from "@nestjs/common";
import { InquiryVerifyRepository } from "../repositories/inquiry-verify.repository";

@Injectable()
export class InquiryVerifyService {
  constructor(
    private readonly inquiryVerifyRepository: InquiryVerifyRepository,
  ) {}

  async isExistInquiryRequestId(id: string): Promise<void> {
    const result = await this.inquiryVerifyRepository.isExistInquiryRequestId(
      id,
    );

    if (!result) {
      throw new BadRequestException(
        "해당 문의 요청 아이디는 데이터베이스에 존재하지 않습니다.",
      );
    }
  }
}
