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
import { IsClientGuard } from "src/common/guards/authenticate/is-client.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";
import { JsonClearCookiesInterface } from "src/common/interceptors/general/interface/json-clear-cookies.interface";
import { JsonGeneralInterface } from "src/common/interceptors/general/interface/json-general-interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryRequestDto } from "../dto/request/inquiry-request.dto";
import { InquiryRequestBundleService } from "../services/request/inquiry-request-bundle.service";
import { InquiryRequestGeneralService } from "../services/request/inquiry-request-general.service";
import { InquiryRequestSendMailService } from "../services/request/inquiry-request-send-mail.service";

@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-client/inquiry")
export class InquiryVersionOneOnlyClientController {
  constructor(
    private readonly inquiryRequestGeneralService: InquiryRequestGeneralService,
    private readonly inquiryRequestBundleService: InquiryRequestBundleService,
    private readonly inquiryRequestSendMailService: InquiryRequestSendMailService,
  ) {}

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/image&video")
  async createInquiryRequestWithImageAndVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.inquiry.request.image_url_cookie)
    inquiryRequestImgCookies: MediaDto[],
    @MediaCookiesParser(mediaCookieKeys.inquiry.request.video_url_cookie)
    inquiryRequestVdoCookies: MediaDto[],
    @Body() inquiryRequestDto: InquiryRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const inquiryRequest =
      await this.inquiryRequestGeneralService.createInquiry({
        productId,
        inquiryRequestDto,
        jwtPayload,
      });

    const mediaWork = async () => {
      await this.inquiryRequestBundleService.pushInquiryMedia({
        inquiryRequestDto,
        inquiryRequestImgCookies,
        inquiryRequestVdoCookies,
      });

      await this.inquiryRequestBundleService.insertInquiryMedia({
        inquiryRequestImgCookies,
        inquiryRequestVdoCookies,
        inquiryRequestDto,
        inquiryRequest,
      });
    };

    await Promise.all([
      mediaWork(),
      this.inquiryRequestSendMailService.sendMailToAdmin(productId),
    ]);

    return {
      statusCode: 201,
      message:
        "문의 요청을 생성하였습니다. 문의 요청은 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
      cookieKey: [
        ...inquiryRequestImgCookies.map((cookie) => cookie.whatCookie),
        ...inquiryRequestVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/image")
  async createInquiryWithImage(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.inquiry.request.image_url_cookie)
    inquiryRequestImgCookies: MediaDto[],
    @Body() inquiryRequestDto: InquiryRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const inquiryRequest =
      await this.inquiryRequestGeneralService.createInquiry({
        productId,
        inquiryRequestDto,
        jwtPayload,
      });

    const mediaWork = async () => {
      await this.inquiryRequestBundleService.pushInquiryMedia({
        inquiryRequestDto,
        inquiryRequestImgCookies,
      });

      await this.inquiryRequestBundleService.insertInquiryMedia({
        inquiryRequestDto,
        inquiryRequest,
        inquiryRequestImgCookies,
      });
    };

    await Promise.all([
      mediaWork(),
      this.inquiryRequestSendMailService.sendMailToAdmin(productId),
    ]);

    return {
      statusCode: 201,
      message:
        "문의 요청을 생성하였습니다. 문의 요청은 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
      cookieKey: [
        ...inquiryRequestImgCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/video")
  async createInquiryWithVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.inquiry.request.video_url_cookie)
    inquiryRequestVdoCookies: MediaDto[],
    @Body() inquiryRequestDto: InquiryRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const inquiryRequest =
      await this.inquiryRequestGeneralService.createInquiry({
        productId,
        inquiryRequestDto,
        jwtPayload,
      });

    const mediaWork = async () => {
      await this.inquiryRequestBundleService.pushInquiryMedia({
        inquiryRequestDto,
        inquiryRequestVdoCookies,
      });

      await this.inquiryRequestBundleService.insertInquiryMedia({
        inquiryRequestVdoCookies,
        inquiryRequestDto,
        inquiryRequest,
      });
    };

    await Promise.all([
      mediaWork(),
      this.inquiryRequestSendMailService.sendMailToAdmin(productId),
    ]);

    return {
      statusCode: 201,
      message:
        "문의 요청을 생성하였습니다. 문의 요청은 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
      cookieKey: [
        ...inquiryRequestVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId")
  async createInquiryWithoutMedia(
    @Param("productId") productId: string,
    @Body() inquiryRequestDto: InquiryRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.inquiryRequestGeneralService.createInquiry({
      productId,
      inquiryRequestDto,
      jwtPayload,
    });

    await this.inquiryRequestSendMailService.sendMailToAdmin(productId);

    return {
      statusCode: 201,
      message:
        "문의 요청을 생성하였습니다. 문의 요청은 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
    };
  }
}
