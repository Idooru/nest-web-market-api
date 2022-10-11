import * as common from "@nestjs/common";
import { CreateReviewDto } from "./../dto/create-review.dto";
import { IsLoginGuard } from "./../../../common/guards/is-login.guard";
import { ReviewService } from "../providers/review.service";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt.payload.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { UseInterceptors, NotFoundException } from "@nestjs/common";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json.clear.cookie.interceptor";
import { JsonClearCookieInterface } from "src/common/interfaces/json.clear.cookie.interface";
import { MediaUrlCookie } from "src/common/interfaces/media.url.cookie.interface";
import { JsonGeneralInterface } from "src/common/interfaces/json.general.interface";
import { JsonGeneralInterceptor } from "../../../common/interceptors/json.general.interceptor";
import { Promises } from "../../../common/config/etc/providers/promises";

@common.Controller("review")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly promises: Promises,
  ) {}

  @UseInterceptors(JsonClearCookieInterceptor)
  @common.UseGuards(IsLoginGuard)
  @common.Post("/product/:productId/image&video")
  async createReviewWithImageAndVideo(
    @common.Param("productId") productId: string,
    @Cookies("Review_Image_Url_COOKIES") reviewImgCookie: MediaUrlCookie[],
    @Cookies("Review_Video_Url_COOKIES") reviewVdoCookie: MediaUrlCookie[],
    @common.Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface> {
    if (!reviewImgCookie.length || !reviewVdoCookie.length) {
      throw new NotFoundException(
        "이미지, 비디오 쿠키가 동시에 준비되어 있어야 합니다.",
      );
    }
    const promise = await Promise.allSettled([
      this.reviewService.increaeStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithImageAndVideo({
        createReviewDto,
        jwtPayload,
        productId,
        reviewImgCookie,
        reviewVdoCookie,
      }),
    ]);

    this.promises.twoPromiseSettled(
      promise[0],
      promise[1],
      "StarRating And Create Review With Image And Video",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: ["Review_Image_Url_COOKIES", "Review_Video_Url_COOKIES"],
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @common.UseGuards(IsLoginGuard)
  @common.Post("/product/:productId/image")
  async createReviewWithImage(
    @common.Param("productId") productId: string,
    @Cookies("Review_Image_Url_COOKIES") reviewImgCookie: MediaUrlCookie[],
    @common.Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface> {
    if (!reviewImgCookie.length) {
      throw new NotFoundException(
        "이미지 쿠키를 찾을 수 없습니다. 우선 사진을 업로드 해주세요.",
      );
    }

    const promise = await Promise.allSettled([
      this.reviewService.increaeStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithImage({
        createReviewDto,
        jwtPayload,
        productId,
        reviewImgCookie,
      }),
    ]);

    this.promises.twoPromiseSettled(
      promise[0],
      promise[1],
      "StarRating And Create Review With Image",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: ["Review_Image_Url_COOKIES"],
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @common.UseGuards(IsLoginGuard)
  @common.Post("/product/:productId/video")
  async createReviewWithVideo(
    @common.Param("productId") productId: string,
    @Cookies("Review_Video_Url_COOKIES") reviewVdoCookie: MediaUrlCookie[],
    @common.Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface> {
    if (!reviewVdoCookie.length) {
      throw new NotFoundException(
        "비디오 쿠키를 찾을 수 없습니다. 우선 동영상을 업로드 해주세요.",
      );
    }
    const promise = await Promise.allSettled([
      this.reviewService.increaeStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithVideo({
        createReviewDto,
        jwtPayload,
        productId,
        reviewVdoCookie,
      }),
    ]);

    this.promises.twoPromiseSettled(
      promise[0],
      promise[1],
      "StarRating And Create Review With Video",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: ["Review_Video_Url_COOKIES"],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @common.UseGuards(IsLoginGuard)
  @common.Post("/product/:productId")
  async createReviewWithoutMedia(
    @common.Param("productId") productId: string,
    @common.Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const promise = await Promise.allSettled([
      this.reviewService.increaeStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithoutMedia({
        createReviewDto,
        jwtPayload,
        productId,
      }),
    ]);

    this.promises.twoPromiseSettled(
      promise[0],
      promise[1],
      "StarRating And Create Review Without Media",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @common.UseGuards(IsLoginGuard)
  @common.Patch("/product/:productId/review/:reviewId/image&video")
  async modifyReviewWithImageAndVideo(
    @common.Param("productId") productId: string,
    @common.Param("reviewId") reviewId: string,
    @Cookies("Review_Image_Url_COOKIES")
    reviewImgCookie: MediaUrlCookie[],
    @Cookies("Review_Video_Url_COOKIES")
    reviewVdoCookie: MediaUrlCookie[],
    @common.Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ) {
    if (!reviewImgCookie.length || !reviewVdoCookie.length) {
      throw new NotFoundException(
        "이미지, 비디오 쿠키가 동시에 준비되어 있어야 합니다.",
      );
    }

    const review = await this.reviewService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    const promise = await Promise.allSettled([
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithImageAndVideo({
        modifyReviewDto,
        review,
        reviewImgCookie,
        reviewVdoCookie,
      }),
    ]);

    this.promises.twoPromiseSettled(
      promise[0],
      promise[1],
      "Modify Star Rating And Review with Image And Video",
    );

    return {
      status: 200,
      message: "리뷰를 수정하였습니다.",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @common.UseGuards(IsLoginGuard)
  @common.Patch("/product/:productId/review/:reviewId/image")
  async modifyReviewWithImage(
    @common.Param("productId") productId: string,
    @common.Param("reviewId") reviewId: string,
    @Cookies("Review_Video_Url_COOKIES")
    reviewImgCookie: MediaUrlCookie[],
    @common.Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ) {
    if (!reviewImgCookie.length) {
      throw new NotFoundException(
        "이미지 쿠키를 찾을 수 없습니다. 우선 이미지를 업로드 해주세요.",
      );
    }

    const review = await this.reviewService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    const promise = await Promise.allSettled([
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithImage({
        modifyReviewDto,
        review,
        reviewImgCookie,
      }),
    ]);

    this.promises.twoPromiseSettled(
      promise[0],
      promise[1],
      "Modify Star Rating And Review with Image",
    );

    return {
      status: 200,
      message: "리뷰를 수정하였습니다.",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @common.UseGuards(IsLoginGuard)
  @common.Patch("/product/:productId/review/:reviewId/video")
  async modifyReviewWithVideo(
    @common.Param("productId") productId: string,
    @common.Param("reviewId") reviewId: string,
    @Cookies("Review_Video_Url_COOKIES")
    reviewVdoCookie: MediaUrlCookie[],
    @common.Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ) {
    if (!reviewVdoCookie.length) {
      throw new NotFoundException(
        "비디오 쿠키를 찾을 수 없습니다. 우선 동영상을 업로드 해주세요.",
      );
    }

    const review = await this.reviewService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    const promise = await Promise.allSettled([
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithVideo({
        modifyReviewDto,
        review,
        reviewVdoCookie,
      }),
    ]);

    this.promises.twoPromiseSettled(
      promise[0],
      promise[1],
      "Modify Star Rating And Review with Video",
    );

    return {
      status: 200,
      message: "리뷰를 수정하였습니다.",
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @common.UseGuards(IsLoginGuard)
  @common.Patch("/product/:productId/review/:reviewId")
  async modifyReveiwWithoutMedia(
    @common.Param("productId") productId: string,
    @common.Param("reviewId") reviewId: string,
    @common.Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const review = await this.reviewService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    const promise = await Promise.allSettled([
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithoutMedia({ modifyReviewDto, review }),
    ]);

    this.promises.twoPromiseSettled(
      promise[0],
      promise[1],
      "Modify Star Rating And Review Without Media",
    );

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
    };
  }
}
