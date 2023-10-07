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
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";
import { ReviewBodyDto } from "../dto/review-body.dto";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { productVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/product-verify-cookie.key";
import { reviewMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReviewTransaction } from "../logic/transaction/review.transaction";
import { ProductIdValidatePipe } from "../../product/pipe/exist/product-id-validate.pipe";
import { ReviewIdValidatePipe } from "../pipe/exist/review-id-validate.pipe";

@ApiTags("v1 고객 Review API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-client/review")
export class ReviewVersionOneOnlyClientController {
  constructor(private readonly reviewTransaction: ReviewTransaction) {}

  @ApiOperation({
    summary: "create review with all medias",
    description:
      "이미지와 비디오가 포함된 리뷰를 생성합니다. 이 api를 실행하기 전에 무조건 리뷰 이미지 혹은 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 리뷰 이미지, 비디오 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/image&video")
  async createReviewWithAllMedias(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await this.reviewTransaction.createReviewWithAllMedias({
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
    summary: "create review with image",
    description:
      "이미지가 포함된 리뷰를 생성합니다. 이 api를 실행하기 전에 무조건 리뷰 이미지를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 리뷰 이미지 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/image")
  async createReviewWithImage(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await this.reviewTransaction.createReviewWithImages({
      reviewBodyDto,
      productId,
      userId: jwtPayload.userId,
      reviewImgCookies,
    });

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @ApiOperation({
    summary: "create review with video",
    description:
      "비디오가 포함된 리뷰를 생성합니다. 이 api를 실행하기 전에 무조건 리뷰 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 리뷰 비디오 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/video")
  async createReviewWithVideo(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await this.reviewTransaction.createReviewWithVideos({
      reviewBodyDto,
      productId,
      userId: jwtPayload.userId,
      reviewVdoCookies,
    });

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @ApiOperation({
    summary: "create review no media",
    description: "미디어 없이 리뷰를 생성합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId")
  async createReviewNoMedia(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.reviewTransaction.createReviewNoMedia({
      reviewBodyDto,
      productId,
      userId: jwtPayload.userId,
    });

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
    };
  }

  @ApiOperation({
    summary: "modify review with all medias",
    description:
      "리뷰 아이디에 해당하는 이미지와 비디오가 포함된 리뷰를 수정합니다. 이 api를 실행하기 전에 무조건 리뷰 이미지 혹은 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 리뷰 이미지, 비디오 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Put("/:reviewId/product/:productId/image&video")
  async modifyReviewWithAllMedias(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @Param("reviewId", ReviewIdValidatePipe) reviewId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewTransaction.modifyReviewWithAllMedias({
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
    summary: "modify review with image",
    description:
      "리뷰 아이디에 해당하는 이미지가 포함된 리뷰를 생성합니다. 이 api를 실행하기 전에 무조건 리뷰 이미지를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 리뷰 이미지 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Put("/:reviewId/product/:productId/image")
  async modifyReviewWithImage(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @Param("reviewId", ReviewIdValidatePipe) reviewId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewTransaction.modifyReviewWithImages({
      reviewBodyDto,
      productId,
      reviewId,
      userId: jwtPayload.userId,
      reviewImgCookies,
    });

    return {
      statusCode: 200,
      message: `리뷰를 수정하였습니다. 해당 리뷰의 수정 횟수가 ${(review.countForModify += 1)}만큼 남았습니다.`,
      cookieKey: [...reviewImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @ApiOperation({
    summary: "modify review with video",
    description:
      "리뷰 아이디에 해당하는 비디오가 포함된 리뷰를 생성합니다. 이 api를 실행하기 전에 무조건 리뷰 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 리뷰 비디오 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Put("/:reviewId/product/:productId/video")
  async modifyReviewWithVideo(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @Param("reviewId", ReviewIdValidatePipe) reviewId: string,
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewTransaction.modifyReviewWithVideos({
      reviewBodyDto,
      productId,
      reviewId,
      userId: jwtPayload.userId,
      reviewVdoCookies,
    });

    return {
      statusCode: 200,
      message: `리뷰를 수정하였습니다. 해당 리뷰의 수정 횟수가 ${(review.countForModify += 1)}만큼 남았습니다.`,
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @ApiOperation({
    summary: "modify review no media",
    description:
      "리뷰 아이디에 해당하는 미디어가 포함되지 않은 리뷰를 수정합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Put("/:reviewId/product/:productId")
  async modifyReviewNoMedia(
    @Param("productId", ProductIdValidatePipe) productId: string,
    @Param("reviewId", ReviewIdValidatePipe) reviewId: string,
    @Body() reviewBodyDto: ReviewBodyDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const review = await this.reviewTransaction.modifyReviewNoMedia({
      reviewBodyDto,
      productId,
      reviewId,
      userId: jwtPayload.userId,
    });

    return {
      statusCode: 200,
      message: `리뷰를 수정하였습니다. 해당 리뷰의 수정 횟수가 ${(review.countForModify += 1)}만큼 남았습니다.`,
    };
  }

  @ApiOperation({
    summary: "delete review",
    description: "리뷰 아이디에 해당하는 모든 형태의 리뷰를 제거합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
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
