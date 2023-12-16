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
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { InquiryRequestBodyDto } from "../dto/request/inquiry-request-body.dto";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InquiryTransaction } from "../logic/transaction/inquiry.transaction";
import { ProductIdValidatePipe } from "../../product/pipe/exist/product-id-validate.pipe";

@ApiTags("v1 고객 Inquiry API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/client/inquiry", version: "1" })
export class InquiryV1ClientController {
  constructor(private readonly inquiryTransaction: InquiryTransaction) {}

  @ApiOperation({
    summary: "create inquiry reqeust",
    description:
      "문의 요청을 생성합니다. 문의 요청에는 이미지 혹은 비디오가 포함될 수 있습니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Post("/product/:productId")
  public async createInquiryRequest(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @MediaCookiesParser(inquiryMediaCookieKey.request.image_url_cookie)
    inquiryRequestImgCookies: MediaCookieDto[],
    @MediaCookiesParser(inquiryMediaCookieKey.request.video_url_cookie)
    inquiryRequestVdoCookies: MediaCookieDto[],
    @Body() inquiryRequestBodyDto: InquiryRequestBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await this.inquiryTransaction.createInquiryRequest({
      inquiryRequestBodyDto,
      productId,
      userId: jwtPayload.userId,
      inquiryRequestImgCookies,
      inquiryRequestVdoCookies,
    });

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
}
