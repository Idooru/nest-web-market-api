import {
  Controller,
  Param,
  Body,
  UseGuards,
  Post,
  Put,
  Delete,
} from "@nestjs/common";
import { CreateReviewDto } from "../dto/create-review.dto";
import { ReviewGeneralService } from "../services/review-general.service";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { UseInterceptors } from "@nestjs/common";
import { ReceiveMediaDto } from "src/model/media/dto/receive-media.dto";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import {
  mediaCookieKeys,
  verifyCookieKeys,
} from "src/common/config/cookie-key-configs";
import { JsonClearCookiesInterface } from "src/common/interceptors/general/interface/json-clear-cookies.interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/general/interface/json-general-interface";
import { StarRateService } from "../services/star-rate-general.service";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsClientGuard } from "src/common/guards/authenticate/is-client.guard";
import { ReviewRedundantService } from "../services/review-redundant.service";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";

@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-client/review")
export class ReviewVersionOneOnlyClientController {
  constructor(
    private readonly reviewGeneralService: ReviewGeneralService,
    private readonly reviewRedundantService: ReviewRedundantService,
    private readonly starRateService: StarRateService,
  ) {}

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/image&video")
  async createReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookies: ReceiveMediaDto[],
    @MediaCookiesParser(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookies: ReceiveMediaDto[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await Promise.all([
      this.starRateService.starRating(createReviewDto, productId),
      this.reviewGeneralService.createReviewWithImage({
        createReviewDto,
        jwtPayload,
        productId,
        reviewImgCookies,
      }),
      this.reviewGeneralService.createReviewWithVideo({
        createReviewDto,
        jwtPayload,
        productId,
        reviewVdoCookies,
      }),
    ]);

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [
        ...reviewImgCookies.map((cookie) => cookie.whatCookie),
        ...reviewVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/image")
  async createReviewWithImage(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookies: ReceiveMediaDto[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await Promise.all([
      this.starRateService.starRating(createReviewDto, productId),
      this.reviewGeneralService.createReviewWithImage({
        createReviewDto,
        jwtPayload,
        productId,
        reviewImgCookies,
      }),
    ]);

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/video")
  async createReviewWithVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookies: ReceiveMediaDto[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await Promise.all([
      this.starRateService.starRating(createReviewDto, productId),
      this.reviewGeneralService.createReviewWithVideo({
        createReviewDto,
        jwtPayload,
        productId,
        reviewVdoCookies,
      }),
    ]);

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId")
  async createReviewWithoutMedia(
    @Param("productId") productId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await Promise.all([
      this.starRateService.starRating(createReviewDto, productId),
      this.reviewGeneralService.createReviewWithoutMedia({
        createReviewDto,
        jwtPayload,
        productId,
      }),
    ]);

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      verifyCookieKeys.review.is_exist.id_executed,
      verifyCookieKeys.product.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId/image&video")
  async modifyReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @MediaCookiesParser(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookies: ReceiveMediaDto[],
    @MediaCookiesParser(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookies: ReceiveMediaDto[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewRedundantService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    await Promise.all([
      this.starRateService.modifyStarRate(modifyReviewDto, productId, review),
      this.reviewGeneralService.modifyReviewWithImageAndVideo({
        modifyReviewDto,
        review,
        reviewImgCookies,
        reviewVdoCookies,
      }),
    ]);

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
      cookieKey: [
        ...reviewImgCookies.map((cookie) => cookie.whatCookie),
        ...reviewVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      verifyCookieKeys.product.is_exist.id_executed,
      verifyCookieKeys.review.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId/image")
  async modifyReviewWithImage(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @MediaCookiesParser(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookies: ReceiveMediaDto[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewRedundantService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    await Promise.all([
      this.starRateService.modifyStarRate(modifyReviewDto, productId, review),
      this.reviewGeneralService.modifyReviewWithImage({
        modifyReviewDto,
        review,
        reviewImgCookies,
      }),
    ]);

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
      cookieKey: [...reviewImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      verifyCookieKeys.product.is_exist.id_executed,
      verifyCookieKeys.review.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId/video")
  async modifyReviewWithVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @MediaCookiesParser(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookies: ReceiveMediaDto[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewRedundantService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    await Promise.all([
      this.starRateService.modifyStarRate(modifyReviewDto, productId, review),
      this.reviewGeneralService.modifyReviewWithVideo({
        modifyReviewDto,
        review,
        reviewVdoCookies,
      }),
    ]);

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      verifyCookieKeys.product.is_exist.id_executed,
      verifyCookieKeys.review.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId")
  async modifyReviewWithoutMedia(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const review = await this.reviewRedundantService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    await Promise.all([
      this.starRateService.modifyStarRate(modifyReviewDto, productId, review),
      this.reviewGeneralService.modifyReviewWithoutMedia({
        modifyReviewDto,
        review,
      }),
    ]);

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.review.is_exist.id_executed))
  @Delete("/:reviewId")
  async deleteReview(
    @Param("reviewId") id: string,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const review = await this.reviewRedundantService.distinguishOwnReview(
      id,
      jwtPayload.userId,
    );

    await this.reviewGeneralService.deleteReview(review);

    return {
      statusCode: 200,
      message: "리뷰를 삭제하였습니다.",
    };
  }
}