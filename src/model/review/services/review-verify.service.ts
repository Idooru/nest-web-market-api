import { BadRequestException, Injectable } from "@nestjs/common";
import { ReviewVerifyRepository } from "../repositories/review-verify.repository";

@Injectable()
export class ReviewVerifyService {
  constructor(
    private readonly reviewVerifyRepository: ReviewVerifyRepository,
  ) {}

  async isExistReviewId(id: string): Promise<void> {
    const result = await this.reviewVerifyRepository.isExistReviewId(id);

    if (!result) {
      throw new BadRequestException(
        "해당 리뷰 아이디는 데이터베이스에 존재하지 않습니다.",
      );
    }
  }
}
