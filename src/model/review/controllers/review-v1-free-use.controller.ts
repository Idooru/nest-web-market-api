import {
  Controller,
  Param,
  Body,
  UseGuards,
  Post,
  Patch,
} from "@nestjs/common";
import { CreateReviewDto } from "../dto/create-review.dto";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { ReviewService } from "../providers/review.service";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { UseInterceptors, NotFoundException } from "@nestjs/common";
import { MediaUrlCookieValue } from "src/model/upload/media.url.cookies.interface";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonGeneralInterceptor } from "../../../common/interceptors/json-general.interceptor";
import { PromiseLibrary } from "src/common/lib/promise.library";
import { Cookie } from "src/common/decorators/cookie.decorator";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { cookieKeys } from "src/common/config/cookie-key-configs";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/json-clear-cookies.interceptor";

@Controller("/api/v1/free-use/review")
export class ReviewVersionOneFreeUseController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly promiseLibrary: PromiseLibrary,
  ) {}

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/image&video")
  async createReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @Cookies(cookieKeys.review.image_url_cookie)
    reviewImgCookies: MediaUrlCookieValue[],
    @Cookies(cookieKeys.review.video_url_cookie)
    reviewVdoCookies: MediaUrlCookieValue[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await this.promiseLibrary.twoPromiseBundle(
      this.reviewService.increaseStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithImageAndVideo({
        createReviewDto,
        jwtPayload,
        productId,
        reviewImgCookies,
        reviewVdoCookies,
      }),
      "Increase star-rating and create review with image and video",
    );

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
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/image")
  async createReviewWithImage(
    @Param("productId") productId: string,
    @Cookies(cookieKeys.review.image_url_cookie)
    reviewImgCookies: MediaUrlCookieValue[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewImgCookies.length) {
      throw new NotFoundException(
        "이미지 쿠키를 찾을 수 없습니다. 우선 사진을 업로드 해주세요.",
      );
    }

    await this.promiseLibrary.twoPromiseBundle(
      this.reviewService.increaseStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithImage({
        createReviewDto,
        jwtPayload,
        productId,
        reviewImgCookies,
      }),
      "Increase star-rating and create review with image",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/video")
  async createReviewWithVideo(
    @Param("productId") productId: string,
    @Cookies(cookieKeys.review.video_url_cookie)
    reviewVdoCookies: MediaUrlCookieValue[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewVdoCookies.length) {
      throw new NotFoundException(
        "비디오 쿠키를 찾을 수 없습니다. 우선 동영상을 업로드 해주세요.",
      );
    }

    await this.promiseLibrary.twoPromiseBundle(
      this.reviewService.increaseStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithVideo({
        createReviewDto,
        jwtPayload,
        productId,
        reviewVdoCookies,
      }),
      "Increase star-rating and create review with video",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId")
  async createReviewWithoutMedia(
    @Param("productId") productId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.promiseLibrary.twoPromiseBundle(
      this.reviewService.increaseStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithoutMedia({
        createReviewDto,
        jwtPayload,
        productId,
      }),
      "Increase star-rating and create review without media",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId/image&video")
  async modifyReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Cookies(cookieKeys.review.image_url_cookie)
    reviewImgCookies: MediaUrlCookieValue[],
    @Cookies(cookieKeys.review.video_url_cookie)
    reviewVdoCookies: MediaUrlCookieValue[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewImgCookies.length || !reviewVdoCookies.length) {
      throw new NotFoundException(
        "이미지, 비디오 쿠키가 동시에 준비되어 있어야 합니다.",
      );
    }

    const review = await this.reviewService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    await this.promiseLibrary.twoPromiseBundle(
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithImageAndVideo({
        modifyReviewDto,
        review,
        reviewImgCookies,
        reviewVdoCookies,
      }),
      "Modify star-rating and review with image and video",
    );

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
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId/image")
  async modifyReviewWithImage(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Cookies(cookieKeys.review.image_url_cookie)
    reviewImgCookies: MediaUrlCookieValue[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewImgCookies.length) {
      throw new NotFoundException(
        "이미지 쿠키를 찾을 수 없습니다. 우선 이미지를 업로드 해주세요.",
      );
    }

    const review = await this.reviewService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    await this.promiseLibrary.twoPromiseBundle(
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithImage({
        modifyReviewDto,
        review,
        reviewImgCookies,
      }),
      "Modify star-rating and review with image",
    );

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
      cookieKey: [...reviewImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId/video")
  async modifyReviewWithVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Cookies(cookieKeys.review.video_url_cookie)
    reviewVdoCookies: MediaUrlCookieValue[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewVdoCookies.length) {
      throw new NotFoundException(
        "비디오 쿠키를 찾을 수 없습니다. 우선 동영상을 업로드 해주세요.",
      );
    }

    const review = await this.reviewService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    await this.promiseLibrary.twoPromiseBundle(
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithVideo({
        modifyReviewDto,
        review,
        reviewVdoCookies,
      }),
      "Modify star-rating and review with video",
    );

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId")
  async modifyReviewWithoutMedia(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const review = await this.reviewService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    await this.promiseLibrary.twoPromiseBundle(
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithoutMedia({ modifyReviewDto, review }),
      "Modify star-rating and review without media",
    );

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
    };
  }
}
