import {
  Controller,
  Get,
  Inject,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { SendVerifyCookieInterceptor } from "src/common/interceptors/verify/send-verify-cookie.interceptor";
import { VerifyDataInterface } from "src/common/interceptors/interface/verify-data.dto";
import { ReviewVerifyService } from "../services/review-verify.service";
import { ReviewVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/review-verify-cookie.key";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("v1 검증 Review API")
@Controller("/api/v1/verify/review")
export class ReviewVersionOneVerifyController {
  constructor(
    @Inject("ReviewVerifyCookieKey")
    private readonly verify: ReviewVerifyCookieKey,
    private readonly reviewVerifyService: ReviewVerifyService,
  ) {}

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/id/:id")
  async isExistReviewId(@Param("id") id: string): Promise<VerifyDataInterface> {
    await this.reviewVerifyService.isExistReviewId(id);

    return {
      message:
        "해당 리뷰 아이디가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.verify.is_exist.id_executed,
    };
  }
}
