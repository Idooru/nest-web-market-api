import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { verifyCookieKeys } from "src/common/config/cookie-key-configs";
import { SendVerifyCookieInterceptor } from "src/common/interceptors/verify/send-verify-cookie.interceptor";
import { VerifyDataDto } from "src/common/interceptors/verify/verify-data.dto";
import { ReviewVerifyService } from "../services/review-verify.service";

@Controller("/api/v1/verify/review")
export class ReviewVersionOneVerify {
  constructor(private readonly reviewVerifyService: ReviewVerifyService) {}

  private readonly reviewVerifyCookieKey = verifyCookieKeys.review;

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/id/:id")
  async isExistReviewId(@Param("id") id: string): Promise<VerifyDataDto> {
    await this.reviewVerifyService.isExistReviewId(id);

    return {
      message:
        "해당 리뷰 아이디가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.reviewVerifyCookieKey.is_exist.id_executed,
    };
  }
}
