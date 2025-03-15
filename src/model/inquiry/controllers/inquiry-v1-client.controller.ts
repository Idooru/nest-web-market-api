import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsClientGuard } from "src/common/guards/authenticate/is-client.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { InquiryRequestBody } from "../dto/request/inquiry-request-body";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InquiryTransactionExecutor } from "../logic/transaction/inquiry-transaction.executor";
import { ProductIdValidatePipe } from "../../product/pipe/exist/product-id-validate.pipe";
import { CreateInquiryRequestDto } from "../dto/request/create-inquiry-request.dto";
import { JsonGeneralInterceptor } from "../../../common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "../../../common/interceptors/interface/json-general-interface";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InquirySearcher } from "../logic/inquiry.searcher";
import { InquiryRequestIdValidatePipe } from "../pipe/exist/inquiry-request-id-validate.pipe";
import { InquiryClientEventInterceptor } from "../interceptor/inquiry-client-event.interceptor";

@ApiTags("v1 고객 Inquiry API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/client/inquiry", version: "1" })
export class InquiryV1ClientController {
  constructor(private readonly transaction: InquiryTransactionExecutor, private readonly searcher: InquirySearcher) {}

  @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry-requests")
  public async findAllInquiryRequests(
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<InquiryRequestEntity[]>> {
    const result = await this.searcher.findAllInquiryRequests(userId);

    return {
      statusCode: 200,
      message: "본인에 대한 문의 요청 정보를 전부 가져옵니다.",
      result,
    };
  }

  @ApiOperation({})
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry-request/:inquiryRequestId")
  public async findInquiryRequest(
    @Param("inquiryRequestId", InquiryRequestIdValidatePipe) inquiryRequestId: string,
  ): Promise<JsonGeneralInterface<InquiryRequestEntity>> {
    const result = await this.searcher.findInquiryRequest(inquiryRequestId);

    return {
      statusCode: 200,
      message: "문의 요청 아이디에 대한 문의 요청 상세 정보를 가져옵니다",
      result,
    };
  }

  @ApiOperation({
    summary: "create inquiry reqeust",
    description: "문의 요청을 생성합니다. 문의 요청에는 이미지 혹은 비디오가 포함될 수 있습니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor, InquiryClientEventInterceptor)
  @Post("/product/:productId")
  public async createInquiryRequest(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.request.imageUrlCookie)
    imageCookies: MediaCookieDto[],
    @MediaCookiesParser(inquiryMediaCookieKey.request.videoUrlCookie)
    videoCookies: MediaCookieDto[],
    @Body() body: InquiryRequestBody,
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const dto: CreateInquiryRequestDto = {
      body,
      productId,
      userId,
      imageCookies,
      videoCookies,
    };

    await this.transaction.createInquiryRequest(dto);

    return {
      statusCode: 201,
      message: "문의 요청을 생성하였습니다. 문의 요청은 한번 작성되면 수정 할 수 없으므로 신중히 작성해주세요.",
      cookieKey: [
        ...imageCookies.map((cookie) => cookie.whatCookie),
        ...videoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }
}
