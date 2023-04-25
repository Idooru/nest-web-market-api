import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryResponseDto } from "../dto/response/inquiry-response.dto";
import { InquiryResponseBundleService } from "../services/response/inquiry-response-bundle.service";
import { InquiryResponseGeneralService } from "../services/response/inquiry-response-general.service";
import { EmailSenderLibrary } from "src/common/lib/email/email-sender.library";
import { inquiryVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/inquiry-verify-cookie.key";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/inquiry")
export class InquiryVersionOneOnlyAdminController {
  constructor(
    private readonly inquiryResponseGeneralService: InquiryResponseGeneralService,
    private readonly inquiryResponseBundleService: InquiryResponseBundleService,
    private readonly emailSenderLibrary: EmailSenderLibrary,
  ) {}

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(
    new VerifyDataGuard(inquiryVerifyCookieKey.response.is_exist.id_executed),
  )
  @Post("/inquiry-request/:inquiryRequestId/user/:userId/image&video")
  async createInquiryResponseWithImageAndVideo(
    @Param("inquiryRequestId") inquiryRequestId: string,
    @Param("userId") userId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.response.image_url_cookie)
    inquiryResponseImgCookies: MediaDto[],
    @MediaCookiesParser(inquiryMediaCookieKey.response.video_url_cookie)
    inquiryResponseVdoCookies: MediaDto[],
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @Body() inquiryResponseDto: InquiryResponseDto,
  ): Promise<JsonClearCookiesInterface> {
    const inquiryResponse =
      await this.inquiryResponseGeneralService.createInquiry({
        userId,
        inquiryRequestId,
        inquiryResponseDto,
        jwtPayload,
      });

    const inquiryResponseId = inquiryResponse.id;

    const mediaWork = async () => {
      await this.inquiryResponseBundleService.pushInquiryMedia({
        inquiryResponseDto,
        inquiryResponseImgCookies,
        inquiryResponseVdoCookies,
      });

      await this.inquiryResponseBundleService.insertInquiryMedia({
        inquiryResponseDto,
        inquiryResponse,
        inquiryResponseImgCookies,
        inquiryResponseVdoCookies,
      });
    };

    const mailWork = async () => {
      const [user, inquiryRequest, inquiryResponse] =
        await this.inquiryResponseBundleService.findStuffForEmail(
          userId,
          inquiryRequestId,
          inquiryResponseId,
        );

      await this.emailSenderLibrary.sendMailToClientAboutInquiryResponse({
        user,
        inquiryRequest,
        inquiryResponse,
      });
    };

    await Promise.all([mediaWork(), mailWork()]);

    return {
      statusCode: 201,
      message: "문의 응답을 생성하였습니다.",
      cookieKey: [
        ...inquiryResponseImgCookies.map((cookie) => cookie.whatCookie),
        ...inquiryResponseVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(
    new VerifyDataGuard(inquiryVerifyCookieKey.response.is_exist.id_executed),
  )
  @Post("/inquiry-request/:inquiryRequestId/user/:userId/image")
  async createInquiryWithImage(
    @Param("inquiryRequestId") inquiryRequestId: string,
    @Param("userId") userId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.response.image_url_cookie)
    inquiryResponseImgCookies: MediaDto[],
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @Body() inquiryResponseDto: InquiryResponseDto,
  ): Promise<JsonClearCookiesInterface> {
    const inquiryResponse =
      await this.inquiryResponseGeneralService.createInquiry({
        userId,
        inquiryRequestId,
        inquiryResponseDto,
        jwtPayload,
      });

    const inquiryResponseId = inquiryResponse.id;

    const mediaWork = async () => {
      await this.inquiryResponseBundleService.pushInquiryMedia({
        inquiryResponseDto,
        inquiryResponseImgCookies,
      });

      await this.inquiryResponseBundleService.insertInquiryMedia({
        inquiryResponseDto,
        inquiryResponse,
        inquiryResponseImgCookies,
      });
    };

    const mailWork = async () => {
      const [user, inquiryRequest, inquiryResponse] =
        await this.inquiryResponseBundleService.findStuffForEmail(
          userId,
          inquiryRequestId,
          inquiryResponseId,
        );

      await this.emailSenderLibrary.sendMailToClientAboutInquiryResponse({
        user,
        inquiryRequest,
        inquiryResponse,
      });
    };

    await Promise.all([mediaWork(), mailWork()]);

    return {
      statusCode: 201,
      message: "문의 응답을 생성하였습니다.",
      cookieKey: [
        ...inquiryResponseImgCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(
    new VerifyDataGuard(inquiryVerifyCookieKey.response.is_exist.id_executed),
  )
  @Post("/inquiry-request/:inquiryRequestId/user/:userId/video")
  async createInquiryWithVideo(
    @Param("inquiryRequestId") inquiryRequestId: string,
    @Param("userId") userId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.response.video_url_cookie)
    inquiryResponseVdoCookies: MediaDto[],
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @Body() inquiryResponseDto: InquiryResponseDto,
  ): Promise<JsonClearCookiesInterface> {
    const inquiryResponse =
      await this.inquiryResponseGeneralService.createInquiry({
        userId,
        inquiryRequestId,
        inquiryResponseDto,
        jwtPayload,
      });

    const inquiryResponseId = inquiryResponse.id;

    const mediaWork = async () => {
      await this.inquiryResponseBundleService.pushInquiryMedia({
        inquiryResponseDto,
        inquiryResponseVdoCookies,
      });

      await this.inquiryResponseBundleService.insertInquiryMedia({
        inquiryResponseDto,
        inquiryResponse,
        inquiryResponseVdoCookies,
      });
    };

    const mailWork = async () => {
      const [user, inquiryRequest, inquiryResponse] =
        await this.inquiryResponseBundleService.findStuffForEmail(
          userId,
          inquiryRequestId,
          inquiryResponseId,
        );

      await this.emailSenderLibrary.sendMailToClientAboutInquiryResponse({
        user,
        inquiryRequest,
        inquiryResponse,
      });
    };

    await Promise.all([mediaWork(), mailWork()]);

    return {
      statusCode: 201,
      message: "문의 응답을 생성하였습니다.",
      cookieKey: [
        ...inquiryResponseVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(inquiryVerifyCookieKey.response.is_exist.id_executed),
  )
  @Post("/inquiry-request/:inquiryRequestId/user/:userId")
  async createInquiryWithoutMedia(
    @Param("inquiryRequestId") inquiryRequestId: string,
    @Param("userId") userId: string,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @Body() inquiryResponseDto: InquiryResponseDto,
  ): Promise<JsonGeneralInterface<void>> {
    const inquiryResponse =
      await this.inquiryResponseGeneralService.createInquiry({
        userId,
        inquiryRequestId,
        inquiryResponseDto,
        jwtPayload,
      });

    const inquiryResponseId = inquiryResponse.id;

    (async () => {
      const [user, inquiryRequest, inquiryResponse] =
        await this.inquiryResponseBundleService.findStuffForEmail(
          userId,
          inquiryRequestId,
          inquiryResponseId,
        );

      await this.emailSenderLibrary.sendMailToClientAboutInquiryResponse({
        user,
        inquiryRequest,
        inquiryResponse,
      });
    })();

    return {
      statusCode: 201,
      message: "문의 응답을 생성하였습니다.",
    };
  }
}
