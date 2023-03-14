import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  mediaCookieKeys,
  verifyCookieKeys,
} from "src/common/config/cookie-key-configs";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";

import { JsonClearCookiesInterface } from "src/common/interceptors/general/interface/json-clear-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ReceiveMediaDto } from "src/model/media/dto/receive-media.dto";
import { CreateInquiryDto } from "../dto/create-inquiry.dto";
import { InquiryGeneralService } from "../services/inquiry-general.service";

@Controller("/api/v1/free-use/inquiry")
export class InquiryVersionOneOnlyClientController {
  constructor(private readonly inquiryGeneralService: InquiryGeneralService) {}

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.inquiry.is_exist.id_executed))
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/image&video")
  async createInquiryWithImageAndVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.inquiry.image_url_cookie)
    inquiryImgCookies: ReceiveMediaDto[],
    @MediaCookiesParser(mediaCookieKeys.inquiry.video_url_cookie)
    inquiryVdoCookies: ReceiveMediaDto[],
    @Body() createInquiryDto: CreateInquiryDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    return {
      statusCode: 201,
      message: "",
      cookieKey: [],
    };
  }
}
