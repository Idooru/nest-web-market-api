import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InquiryTransactionExecutor } from "../logic/transaction/inquiry-transaction.executor";
import { InquiryRequestIdValidatePipe } from "../pipe/exist/inquiry-request-id-validate.pipe";
import { InquiryRequesterIdValidatePipe } from "../pipe/exist/inquiry-requester-id-validate.pipe";
import { JsonGeneralInterface } from "../../../common/interceptors/interface/json-general-interface";
import { InquiryResponseIdValidatePipe } from "../pipe/exist/inquiry-response-id-validate.pipe";
import { InquiryAdminEventInterceptor } from "../interceptor/inquiry-admin-event.interceptor";
import { JsonGeneralInterceptor } from "../../../common/interceptors/general/json-general.interceptor";
import { InquiryResponseBody } from "../dto/inquiry-response/request/inquiry-response-body.dto";
import { CreateInquiryResponseDto } from "../dto/inquiry-response/request/create-inquiry-response.dto";
import { InquiryResponseSearcher } from "../logic/inquiry-response.searcher";
import { InquiryResponseBasicRawDto } from "../dto/inquiry-response/response/inquiry-response-basic-raw.dto";
import { InquiryRequestSearcher } from "../logic/inquiry-request.searcher";
import { InquiryRequestFromAdminProductRawDto } from "../dto/inquiry-request/response/inquiry-request-from-admin-product-raw.dto";
import { InquiryResponseDetailRawDto } from "../dto/inquiry-response/response/inquiry-response-detail-raw.dto";
import { FindAllInquiryResponsesDto } from "../dto/inquiry-response/request/find-all-inquiry-responses.dto";
import { MediaCookieDto } from "../../media/dto/request/media-cookie.dto";

@ApiTags("v1 관리자 Inquiry API")
@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "admin/inquiry", version: "1" })
export class InquiryV1AdminController {
  constructor(
    private readonly transaction: InquiryTransactionExecutor,
    private readonly inquiryRequestSearcher: InquiryRequestSearcher,
    private readonly inquiryResponseSearcher: InquiryResponseSearcher,
  ) {}

  // @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry-response/all")
  public async findAllInquiryResponses(
    @Query() query: FindAllInquiryResponsesDto,
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<InquiryResponseBasicRawDto[]>> {
    query.userId = userId;
    const result = await this.inquiryResponseSearcher.findAllRaws(query);

    return {
      statusCode: 200,
      message: "본인에 대한 문의 응답 전부를 가져옵니다.",
      result,
    };
  }

  // @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry-response/:inquiryResponseId")
  public async findInquiryResponse(
    @Param("inquiryResponseId", InquiryResponseIdValidatePipe) inquiryResponseId: string,
  ): Promise<JsonGeneralInterface<InquiryResponseDetailRawDto>> {
    const result = await this.inquiryResponseSearcher.findDetailRaw(inquiryResponseId);

    return {
      statusCode: 200,
      message: "본인에 대한 문의 응답 상세 정보를 가져옵니다.",
      result,
    };
  }

  // @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry-request/product")
  public async findInquiryRequestFromProduct(
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<InquiryRequestFromAdminProductRawDto[]>> {
    const result = await this.inquiryRequestSearcher.findAllRawsFromProduct(userId);

    return {
      statusCode: 200,
      message: "상품에 해당하는 문의 요청 정보를 전부 가져옵니다.",
      result,
    };
  }

  // @ApiOperation({
  //   summary: "create inquiry response",
  //   description: "문의 응답을 생성합니다. 문의 응답에는 이미지 혹은 비디오가 포함될 수 있습니다.",
  // })
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
