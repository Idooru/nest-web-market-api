import {
  Controller,
  Get,
  Inject,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { SendVerifyCookieInterceptor } from "src/common/interceptors/verify/send-verify-cookie.interceptor";
import { VerifyDataDto } from "src/common/interceptors/verify/verify-data.dto";
import { InquiryVerifyService } from "../services/inquiry-verify.service";
import { InquiryVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/inquiry-verify-cookie.key";

@Controller("/api/v1/verify/inquiry")
export class InquiryVersionOneVerifyController {
  constructor(
    @Inject("InquiryVerifyCookieKey")
    private readonly verify: InquiryVerifyCookieKey,
    private readonly inquiryVerfiyService: InquiryVerifyService,
  ) {}

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/id/:id")
  async isExistInquiryRequestId(
    @Param("id") id: string,
  ): Promise<VerifyDataDto> {
    await this.inquiryVerfiyService.isExistInquiryRequestId(id);

    return {
      message:
        "해당 문의 요청 아이디가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.verify.request.is_exist.id_executed,
    };
  }
}
