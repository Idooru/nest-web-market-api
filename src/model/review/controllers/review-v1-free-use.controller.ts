import {
  Controller,
  Param,
  Body,
  UseGuards,
  Post,
  Patch,
} from "@nestjs/common";
import { CreateReviewDto } from "../dto/create-review.dto";
import { ReviewService } from "../providers/review.service";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { UseInterceptors, NotFoundException } from "@nestjs/common";
import { MediaUrlCookieValue } from "src/model/upload/media.url.cookies.interface";
import { PromiseLibrary } from "src/common/lib/promise.library";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { mediaCookieKeys } from "src/common/config/cookie-key-configs";
import { JsonClearCookiesInterface } from "src/common/interceptors/general/interface/json-clear-cookies.interface";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonGeneralInterface } from "src/common/interceptors/general/interface/json-general-interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";

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
    @Cookies(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookie: MediaUrlCookieValue[],
    @Cookies(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookie: MediaUrlCookieValue[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await Promise.all([
      this.reviewService.increaseStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithImageAndVideo({
        createReviewDto,
        jwtPayload,
        productId,
        reviewImgCookie,
        reviewVdoCookie,
      }),
    ]);

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [
        ...reviewImgCookie.map((cookie) => cookie.whatCookie),
        ...reviewVdoCookie.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/image")
  async createReviewWithImage(
    @Param("productId") productId: string,
    @Cookies(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookie: MediaUrlCookieValue[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewImgCookie.length) {
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
        reviewImgCookie,
      }),
      "Increase star-rating and create review with image",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewImgCookie.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/video")
  async createReviewWithVideo(
    @Param("productId") productId: string,
    @Cookies(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookie: MediaUrlCookieValue[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewVdoCookie.length) {
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
        reviewVdoCookie,
      }),
      "Increase star-rating and create review with video",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewVdoCookie.map((cookie) => cookie.whatCookie)],
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
    @Cookies(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookie: MediaUrlCookieValue[],
    @Cookies(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookie: MediaUrlCookieValue[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewImgCookie.length || !reviewVdoCookie.length) {
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
        reviewImgCookie,
        reviewVdoCookie,
      }),
      "Modify star-rating and review with image and video",
    );

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
      cookieKey: [
        ...reviewImgCookie.map((cookie) => cookie.whatCookie),
        ...reviewVdoCookie.map((cookie) => cookie.whatCookie),
      ],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId/image")
  async modifyReviewWithImage(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Cookies(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookie: MediaUrlCookieValue[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewImgCookie.length) {
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
        reviewImgCookie,
      }),
      "Modify star-rating and review with image",
    );

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
      cookieKey: [...reviewImgCookie.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId/video")
  async modifyReviewWithVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Cookies(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookie: MediaUrlCookieValue[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewVdoCookie.length) {
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
        reviewVdoCookie,
      }),
      "Modify star-rating and review with video",
    );

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
      cookieKey: [...reviewVdoCookie.map((cookie) => cookie.whatCookie)],
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
