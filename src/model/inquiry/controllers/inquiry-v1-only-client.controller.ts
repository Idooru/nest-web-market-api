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
import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { InquiryRequestDto } from "../dto/inquiry-request.dto";
import { InquiryBundleService } from "../services/inquiry-bundle.service";
import { InquiryGeneralService } from "../services/inquiry-general.service";
import { InquirySendMailService } from "../services/inquiry-send-mail.service";

@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-client/inquiry")
export class InquiryVersionOneOnlyClientController {
  constructor(
    private readonly inquiryGeneralService: InquiryGeneralService,
    private readonly inquiryBundleService: InquiryBundleService,
    private readonly inquirySendMailService: InquirySendMailService,
  ) {}

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/image&video")
  async createInquiryWithImageAndVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.inquiry.image_url_cookie)
    inquiryImgCookies: RequestMediaDto[],
    @MediaCookiesParser(mediaCookieKeys.inquiry.video_url_cookie)
    inquiryVdoCookies: RequestMediaDto[],
    @Body() inquiryRequestDto: InquiryRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const inquiry = await this.inquiryGeneralService.createInquiry({
      productId,
      inquiryRequestDto,
      jwtPayload,
    });

    const mediaWork = async () => {
      await this.inquiryBundleService.pushInquiryMedia({
        inquiryRequestDto,
        inquiryImgCookies,
        inquiryVdoCookies,
      });

      await this.inquiryBundleService.insertInquiryMedia({
        inquiryImgCookies,
        inquiryVdoCookies,
        inquiryRequestDto,
        inquiry,
      });
    };

    await Promise.all([
      mediaWork(),
      this.inquirySendMailService.sendMailToAdmin({
        userId: jwtPayload.userId,
        productId,
      }),
    ]);

    return {
      statusCode: 201,
      message:
        "문의를 생성하였습니다. 문의는 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
      cookieKey: [
        ...inquiryImgCookies.map((cookie) => cookie.whatCookie),
        ...inquiryVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/image")
  async createInquiryWithImage(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.inquiry.image_url_cookie)
    inquiryImgCookies: RequestMediaDto[],
    @Body() inquiryRequestDto: InquiryRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const inquiry = await this.inquiryGeneralService.createInquiry({
      productId,
      inquiryRequestDto,
      jwtPayload,
    });

    const mediaWork = async () => {
      await this.inquiryBundleService.pushInquiryMedia({
        inquiryRequestDto,
        inquiryImgCookies,
      });

      await this.inquiryBundleService.insertInquiryMedia({
        inquiryRequestDto,
        inquiry,
        inquiryImgCookies,
      });
    };

    await Promise.all([
      mediaWork(),
      this.inquirySendMailService.sendMailToAdmin({
        userId: jwtPayload.userId,
        productId,
      }),
    ]);

    return {
      statusCode: 201,
      message:
        "문의를 생성하였습니다. 문의는 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
      cookieKey: [...inquiryImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/video")
  async createInquiryWithVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.inquiry.video_url_cookie)
    inquiryVdoCookies: RequestMediaDto[],
    @Body() inquiryRequestDto: InquiryRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const inquiry = await this.inquiryGeneralService.createInquiry({
      productId,
      inquiryRequestDto,
      jwtPayload,
    });

    const mediaWork = async () => {
      await this.inquiryBundleService.pushInquiryMedia({
        inquiryRequestDto,
        inquiryVdoCookies,
      });

      await this.inquiryBundleService.insertInquiryMedia({
        inquiryVdoCookies,
        inquiryRequestDto,
        inquiry,
      });
    };

    await Promise.all([
      mediaWork(),
      this.inquirySendMailService.sendMailToAdmin({
        productId,
        userId: jwtPayload.userId,
      }),
    ]);

    return {
      statusCode: 201,
      message:
        "문의를 생성하였습니다. 문의는 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
      cookieKey: [...inquiryVdoCookies.map((cookie) => cookie.whatCookie)],
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
    await this.inquiryGeneralService.createInquiry({
      productId,
      inquiryRequestDto,
      jwtPayload,
    });

    await this.inquirySendMailService.sendMailToAdmin({
      productId,
      userId: jwtPayload.userId,
    });

    return {
      statusCode: 201,
      message:
        "문의를 생성하였습니다. 문의는 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
    };
  }
}
