import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { InquiryResponseBody } from "../dto/response/inquiry-response-body.dto";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InquiryTransactionExecutor } from "../logic/transaction/inquiry-transaction.executor";
import { InquiryRequestIdValidatePipe } from "../pipe/exist/inquiry-request-id-validate.pipe";
import { InquiryRequesterIdValidatePipe } from "../pipe/exist/inquiry-requester-id-validate.pipe";
import { CreateInquiryResponseDto } from "../dto/response/create-inquiry-response.dto";
import { InquirySearcher } from "../logic/inquiry.searcher";
import { JsonGeneralInterface } from "../../../common/interceptors/interface/json-general-interface";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseIdValidatePipe } from "../pipe/exist/inquiry-response-id-validate.pipe";
import { InquiryAdminEventInterceptor } from "../interceptor/inquiry-admin-event.interceptor";
import { JsonGeneralInterceptor } from "../../../common/interceptors/general/json-general.interceptor";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";

@ApiTags("v1 관리자 Inquiry API")
@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "admin/inquiry", version: "1" })
export class InquiryV1AdminController {
  constructor(private readonly transaction: InquiryTransactionExecutor, private readonly searcher: InquirySearcher) {}

  @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry-responses")
  public async findAllInquiryResponses(
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<InquiryResponseEntity[]>> {
    const result = await this.searcher.findAllInquiryResponses(userId);

    return {
      statusCode: 200,
      message: "본인에 대한 문의 응답 정보를 전부 가져옵니다.",
      result,
    };
  }

  @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry-response/:inquiryResponseId")
  public async findInquiryResponse(
    @Param("inquiryResponseId", InquiryResponseIdValidatePipe) inquiryResponseId: string,
  ): Promise<JsonGeneralInterface<InquiryResponseEntity>> {
    const result = await this.searcher.findInquiryResponse(inquiryResponseId);

    return {
      statusCode: 200,
      message: "본인에 대한 문의 응답 상세 정보를 가져옵니다.",
      result,
    };
  }

  @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry-request/admin-product")
  public async findInquiryRequestFromAdminProduct(
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<InquiryRequestEntity[]>> {
    const result = await this.searcher.findInquiryRequestFromAdminProduct(userId);

    return {
      statusCode: 200,
      message: "관라자의 해당하는 상품의 문의 요청 정보를 전부 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "create inquiry response",
    description: "문의 응답을 생성합니다. 문의 응답에는 이미지 혹은 비디오가 포함될 수 있습니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor, InquiryAdminEventInterceptor)
  @Post("/inquiry-request/:inquiryRequestId/client-user/:inquiryRequesterId")
  public async createInquiryResponse(
    @Param("inquiryRequestId", InquiryRequestIdValidatePipe)
    inquiryRequestId: string,
    @Param("inquiryRequesterId", InquiryRequesterIdValidatePipe)
    inquiryRequesterId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.response.imageUrlCookie)
    imageCookies: MediaCookieDto[],
    @MediaCookiesParser(inquiryMediaCookieKey.response.videoUrlCookie)
    videoCookies: MediaCookieDto[],
    @GetJWT() { userId }: JwtAccessTokenPayload,
    @Body() body: InquiryResponseBody,
  ): Promise<JsonClearCookiesInterface> {
    const dto: CreateInquiryResponseDto = {
      body,
      inquiryRequestId,
      inquiryRequesterId,
      inquiryRespondentId: userId,
      imageCookies,
      videoCookies,
    };

    await this.transaction.createInquiryResponse(dto);

    return {
      statusCode: 201,
      message: "문의 응답을 생성하였습니다.",
      cookieKey: [
        ...imageCookies.map((cookie) => cookie.whatCookie),
        ...videoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }
}
