import {
  Controller,
  Param,
  Body,
  UseGuards,
  Post,
  Put,
  Delete,
} from "@nestjs/common";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { UseInterceptors } from "@nestjs/common";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsClientGuard } from "src/common/guards/authenticate/is-client.guard";
import { ReviewBodyDto } from "../../dto/review-body.dto";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { reviewMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReviewTransaction } from "../../logic/transaction/review.transaction";
import { ProductIdValidatePipe } from "../../../product/pipe/exist/product-id-validate.pipe";
import { ReviewIdValidatePipe } from "../../pipe/exist/review-id-validate.pipe";

@ApiTags("v1 고객 Review API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "client/review", version: "1" })
export class ReviewV1ClientController {
  constructor(private readonly reviewTransaction: ReviewTransaction) {}

  @ApiOperation({
    summary: "create review",
    description:
      "리뷰를 생성합니다. 리뷰에는 이미지 혹은 비디오가 포함될 수 있습니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Post("/product/:productId")
  public async createReview(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await this.reviewTransaction.createReview({
      reviewBodyDto,
      productId,
      userId: jwtPayload.userId,
      reviewImgCookies,
      reviewVdoCookies,
    });

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [
        ...reviewImgCookies.map((cookie) => cookie.whatCookie),
        ...reviewVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @ApiOperation({
    summary: "modify review",
    description:
      "리뷰를 수정합니다. 리뷰에는 이미지 혹은 비디오가 포함될 수 있습니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Put("/:reviewId/product/:productId")
  public async modifyReview(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @Param("reviewId", ReviewIdValidatePipe) reviewId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewTransaction.modifyReview({
      reviewBodyDto,
      productId,
      reviewId,
      userId: jwtPayload.userId,
      reviewImgCookies,
      reviewVdoCookies,
    });

    return {
      statusCode: 200,
      message: `리뷰를 수정하였습니다. 해당 리뷰의 수정 횟수가 ${(review.countForModify += 1)}만큼 남았습니다.`,
      cookieKey: [
        ...reviewImgCookies.map((cookie) => cookie.whatCookie),
        ...reviewVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @ApiOperation({
    summary: "delete review",
    description: "리뷰 아이디에 해당하는 모든 형태의 리뷰를 제거합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/:reviewId/product/:productId")
  async deleteReview(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @Param("reviewId", ReviewIdValidatePipe) reviewId: string,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.reviewTransaction.deleteReview({
      reviewId,
      productId,
      userId: jwtPayload.userId,
    });

    return {
      statusCode: 200,
      message: "리뷰를 삭제하였습니다.",
    };
  }
}
