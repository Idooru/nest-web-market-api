import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { verifyCookieKeys } from "src/common/config/cookie-key-configs";
import { SendVerifyCookieInterceptor } from "src/common/interceptors/verify/send-verify-cookie.interceptor";
import { VerifyDataDto } from "src/common/interceptors/verify/verify-data.dto";
import { InquiryVerifyService } from "../services/inquiry-verify.service";

@Controller("/api/v1/verify/inquiry")
export class InquiryVersionOneVerifyController {
  constructor(private readonly inquiryVerfiyService: InquiryVerifyService) {}

  private readonly inquiryVerifyCookieKey = verifyCookieKeys.inquiry;

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/id/:id")
  async isExistInquiryRequestId(
    @Param("id") id: string,
  ): Promise<VerifyDataDto> {
    await this.inquiryVerfiyService.isExistInquiryRequestId(id);

    return {
      message:
        "해당 문의 요청 아이디가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.inquiryVerifyCookieKey.request.is_exist.id_executed,
    };
  }
}
