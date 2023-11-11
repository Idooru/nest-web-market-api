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
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { InquiryResponseBodyDto } from "../dto/response/inquiry-response-body.dto";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InquiryTransaction } from "../logic/transaction/inquiry.transaction";
import { InquiryRequestIdValidatePipe } from "../pipe/exist/inquiry-request-id-validate.pipe";
import { InquiryRequesterIdValidatePipe } from "../pipe/exist/inquiry-requester-id-validate.pipe";

@ApiTags("v1 관리자 Inquiry API")
@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/inquiry")
export class InquiryVersionOneOnlyAdminController {
  constructor(private readonly inquiryTransaction: InquiryTransaction) {}

  @ApiOperation({
    summary: "create inquiry response",
    description:
      "문의 응답을 생성합니다. 문의 응답에는 이미지 혹은 비디오가 포함될 수 있습니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Post("/inquiry-request/:inquiryRequestId/client-user/:inquiryRequesterId")
  public async createInquiryResponse(
    @Param("inquiryRequestId", InquiryRequestIdValidatePipe)
    inquiryRequestId: string,
    @Param("inquiryRequesterId", InquiryRequesterIdValidatePipe)
    inquiryRequesterId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.response.image_url_cookie)
    inquiryResponseImgCookies: MediaCookieDto[],
    @MediaCookiesParser(inquiryMediaCookieKey.response.video_url_cookie)
    inquiryResponseVdoCookies: MediaCookieDto[],
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @Body() inquiryResponseBodyDto: InquiryResponseBodyDto,
  ): Promise<JsonClearCookiesInterface> {
    await this.inquiryTransaction.createInquiryResponse({
      inquiryResponseBodyDto,
      inquiryRequestId,
      inquiryRequesterId,
      inquiryResponserId: jwtPayload.userId,
      inquiryResponseImgCookies,
      inquiryResponseVdoCookies,
    });

    return {
      statusCode: 201,
      message: "문의 응답을 생성하였습니다.",
      cookieKey: [
        ...inquiryResponseImgCookies.map((cookie) => cookie.whatCookie),
        ...inquiryResponseVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }
  //
  // @ApiOperation({
  //   summary: "create inquiry response with image and video",
  //   description:
  //     "이미지와 비디오가 포함된 문의 응답을 생성합니다. 이 api를 실행하기 전에 무조건 문의 응답 이미지 혹은 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 문의 응답 이미지, 비디오 쿠키를 사용합니다.",
  // })
  // @UseInterceptors(JsonClearCookiesInterceptor)
  // @Post(
  //   "/inquiry-request/:inquiryRequestId/client-user/:inquiryRequesterId/image&video",
  // )
  // async createInquiryResponseWithImageAndVideo(
  //   @Param("inquiryRequestId", InquiryRequestIdValidatePipe)
  //   inquiryRequestId: string,
  //   @Param("inquiryRequesterId", InquiryRequesterIdValidatePipe)
  //   inquiryRequesterId: string,
  //   @MediaCookiesParser(inquiryMediaCookieKey.response.image_url_cookie)
  //   inquiryResponseImgCookies: MediaCookieDto[],
  //   @MediaCookiesParser(inquiryMediaCookieKey.response.video_url_cookie)
  //   inquiryResponseVdoCookies: MediaCookieDto[],
  //   @GetJWT() jwtPayload: JwtAccessTokenPayload,
  //   @Body() inquiryResponseBodyDto: InquiryResponseBodyDto,
  // ): Promise<JsonClearCookiesInterface> {
  //   await this.inquiryTransaction.createInquiryResponseAllMedias({
  //     inquiryResponseBodyDto,
  //     inquiryRequestId,
  //     inquiryRequesterId,
  //     inquiryResponserId: jwtPayload.userId,
  //     inquiryResponseImgCookies,
  //     inquiryResponseVdoCookies,
  //   });
  //
  //   return {
  //     statusCode: 201,
  //     message: "문의 응답을 생성하였습니다.",
  //     cookieKey: [
  //       ...inquiryResponseImgCookies.map((cookie) => cookie.whatCookie),
  //       ...inquiryResponseVdoCookies.map((cookie) => cookie.whatCookie),
  //     ],
  //   };
  // }
  //
  // @ApiOperation({
  //   summary: "create inquiry response with image",
  //   description:
  //     "이미지가 포함된 문의 응답을 생성합니다. 이 api를 실행하기 전에 무조건 문의 응답 이미지를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 문의 응답 이미지 쿠키를 사용합니다.",
  // })
  // @UseInterceptors(JsonClearCookiesInterceptor)
  // @Post(
  //   "/inquiry-request/:inquiryRequestId/client-user/:inquiryRequesterId/image",
  // )
  // async createInquiryResponseWithImage(
  //   @Param("inquiryRequestId", InquiryRequestIdValidatePipe)
  //   inquiryRequestId: string,
  //   @Param("inquiryRequesterId", InquiryRequesterIdValidatePipe)
  //   inquiryRequesterId: string,
  //   @MediaCookiesParser(inquiryMediaCookieKey.response.image_url_cookie)
  //   inquiryResponseImgCookies: MediaCookieDto[],
  //   @GetJWT() jwtPayload: JwtAccessTokenPayload,
  //   @Body() inquiryResponseBodyDto: InquiryResponseBodyDto,
  // ): Promise<JsonClearCookiesInterface> {
  //   await this.inquiryTransaction.createInquiryResponseWithImages({
  //     inquiryResponseBodyDto,
  //     inquiryRequestId,
  //     inquiryRequesterId,
  //     inquiryResponserId: jwtPayload.userId,
  //     inquiryResponseImgCookies,
  //   });
  //
  //   return {
  //     statusCode: 201,
  //     message: "문의 응답을 생성하였습니다.",
  //     cookieKey: [
  //       ...inquiryResponseImgCookies.map((cookie) => cookie.whatCookie),
  //     ],
  //   };
  // }
  //
  // @ApiOperation({
  //   summary: "create inquiry response with video",
  //   description:
  //     "비디오가 포함된 문의 응답을 생성합니다. 이 api를 실행하기 전에 무조건 문의 응답 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 문의 응답 비디오 쿠키를 사용합니다.",
  // })
  // @UseInterceptors(JsonClearCookiesInterceptor)
  // @Post(
  //   "/inquiry-request/:inquiryRequestId/client-user/:inquiryRequesterId/video",
  // )
  // async createInquiryResponseWithVideo(
  //   @Param("inquiryRequestId", InquiryRequestIdValidatePipe)
  //   inquiryRequestId: string,
  //   @Param("inquiryRequesterId", InquiryRequesterIdValidatePipe)
  //   inquiryRequesterId: string,
  //   @MediaCookiesParser(inquiryMediaCookieKey.response.video_url_cookie)
  //   inquiryResponseVdoCookies: MediaCookieDto[],
  //   @GetJWT() jwtPayload: JwtAccessTokenPayload,
  //   @Body() inquiryResponseBodyDto: InquiryResponseBodyDto,
  // ): Promise<JsonClearCookiesInterface> {
  //   await this.inquiryTransaction.createInquiryResponseWithVideos({
  //     inquiryResponseBodyDto,
  //     inquiryRequestId,
  //     inquiryRequesterId,
  //     inquiryResponserId: jwtPayload.userId,
  //     inquiryResponseVdoCookies,
  //   });
  //
  //   return {
  //     statusCode: 201,
  //     message: "문의 응답을 생성하였습니다.",
  //     cookieKey: [
  //       ...inquiryResponseVdoCookies.map((cookie) => cookie.whatCookie),
  //     ],
  //   };
  // }
  //
  // @ApiOperation({
  //   summary: "create inquiry response without media",
  //   description: "미디어 없이 문의 응답을 생성합니다.",
  // })
  // @UseInterceptors(JsonGeneralInterceptor)
  // @Post("/inquiry-request/:inquiryRequestId/client-user/:inquiryRequesterId")
  // async createInquiryResponseWithoutMedia(
  //   @Param("inquiryRequestId", InquiryRequestIdValidatePipe)
  //   inquiryRequestId: string,
  //   @Param("inquiryRequesterId", InquiryRequesterIdValidatePipe)
  //   inquiryRequesterId: string,
  //   @GetJWT() jwtPayload: JwtAccessTokenPayload,
  //   @Body() inquiryResponseBodyDto: InquiryResponseBodyDto,
  // ): Promise<JsonGeneralInterface<void>> {
  //   await this.inquiryTransaction.createInquiryResponseNoMedia({
  //     inquiryResponseBodyDto,
  //     inquiryRequestId,
  //     inquiryRequesterId,
  //     inquiryResponserId: jwtPayload.userId,
  //   });
  //
  //   return {
  //     statusCode: 201,
  //     message: "문의 응답을 생성하였습니다.",
  //   };
  // }
}
