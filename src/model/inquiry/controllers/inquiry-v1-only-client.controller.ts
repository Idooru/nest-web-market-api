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
import { IsClientGuard } from "src/common/guards/authenticate/is-client.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryRequestDto } from "../dto/request/inquiry-request.dto";
import { InquiryRequestBundleService } from "../services/request/inquiry-request-bundle.service";
import { InquiryRequestGeneralService } from "../services/request/inquiry-request-general.service";
import { EmailSenderLibrary } from "src/common/lib/email/email-sender.library";
import { productVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/product-verify-cookie.key";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("v1 고객 Inquiry API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-client/inquiry")
export class InquiryVersionOneOnlyClientController {
  constructor(
    private readonly inquiryRequestGeneralService: InquiryRequestGeneralService,
    private readonly inquiryRequestBundleService: InquiryRequestBundleService,
    private readonly emailSenderLibrary: EmailSenderLibrary,
  ) {}

  @ApiOperation({
    summary: "create inquiry request with image and video",
    description:
      "이미지와 비디오가 포함된 문의 요청을 생성합니다. 이 api를 실행하기 전에 무조건 문의 요청 이미지 혹은 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 문의 요청 이미지, 비디오 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/image&video")
  async createInquiryRequestWithImageAndVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.request.image_url_cookie)
    inquiryRequestImgCookies: MediaDto[],
    @MediaCookiesParser(inquiryMediaCookieKey.request.video_url_cookie)
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

    const inquiryRequestId = inquiryRequest.id;

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

    const mailWork = async () => {
      const [product, inquiryRequest] =
        await this.inquiryRequestBundleService.findStuffForEmail(
          productId,
          inquiryRequestId,
        );

      await this.emailSenderLibrary.sendMailToAdminAboutInquiryRequest({
        product,
        inquiryRequest,
      });
    };

    await Promise.all([mediaWork, mailWork]);

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

  @ApiOperation({
    summary: "create inquiry request with image",
    description:
      "이미지가 포함된 문의 요청을 생성합니다. 이 api를 실행하기 전에 무조건 문의 요청 이미지를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 문의 요청 이미지 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/image")
  async createInquiryWithImage(
    @Param("productId") productId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.request.image_url_cookie)
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

    const inquiryRequestId = inquiryRequest.id;

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

    const mailWork = async () => {
      const [product, inquiryRequest] =
        await this.inquiryRequestBundleService.findStuffForEmail(
          productId,
          inquiryRequestId,
        );

      await this.emailSenderLibrary.sendMailToAdminAboutInquiryRequest({
        product,
        inquiryRequest,
      });
    };

    await Promise.all([mediaWork, mailWork]);

    return {
      statusCode: 201,
      message:
        "문의 요청을 생성하였습니다. 문의 요청은 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
      cookieKey: [
        ...inquiryRequestImgCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @ApiOperation({
    summary: "create inquiry request with video",
    description:
      "비디오가 포함된 문의 요청을 생성합니다. 이 api를 실행하기 전에 무조건 문의 요청 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 문의 요청 비디오 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/video")
  async createInquiryWithVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.request.video_url_cookie)
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

    const inquiryRequestId = inquiryRequest.id;

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

    const mailWork = async () => {
      const [product, inquiryRequest] =
        await this.inquiryRequestBundleService.findStuffForEmail(
          productId,
          inquiryRequestId,
        );

      await this.emailSenderLibrary.sendMailToAdminAboutInquiryRequest({
        product,
        inquiryRequest,
      });
    };

    await Promise.all([mediaWork, mailWork]);

    return {
      statusCode: 201,
      message:
        "문의 요청을 생성하였습니다. 문의 요청은 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
      cookieKey: [
        ...inquiryRequestVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @ApiOperation({
    summary: "create inquiry request without media",
    description: "미디어 없이 문의 요청을 생성합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId")
  async createInquiryWithoutMedia(
    @Param("productId") productId: string,
    @Body() inquiryRequestDto: InquiryRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const inquiryRequest =
      await this.inquiryRequestGeneralService.createInquiry({
        productId,
        inquiryRequestDto,
        jwtPayload,
      });

    const inquiryRequestId = inquiryRequest.id;

    (async () => {
      const [product, inquiryRequest] =
        await this.inquiryRequestBundleService.findStuffForEmail(
          productId,
          inquiryRequestId,
        );

      await this.emailSenderLibrary.sendMailToAdminAboutInquiryRequest({
        product,
        inquiryRequest,
      });
    })();

    return {
      statusCode: 201,
      message:
        "문의 요청을 생성하였습니다. 문의 요청은 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
    };
  }
}
