import {
  Controller,
  Param,
  Body,
  UseGuards,
  Post,
  Patch,
} from "@nestjs/common";
import { CreateReviewDto } from "./../dto/create-review.dto";
import { IsLoginGuard } from "./../../../common/guards/is-login.guard";
import { ReviewService } from "../providers/review.service";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { UseInterceptors, NotFoundException } from "@nestjs/common";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json-clear-cookie.interceptor";
import { MediaUrlCookies } from "src/model/upload/media.url.cookies.interface";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonGeneralInterceptor } from "../../../common/interceptors/json-general.interceptor";
import { PromiseLibrary } from "src/common/lib/promise.library";
import { Cookie } from "src/common/decorators/cookie.decorator";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";

@Controller("review")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly promiseLbirary: PromiseLibrary,
  ) {}

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/image&video")
  async createReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @Cookies("Review_Image_Url_COOKIES")
    reviewImgCookie: MediaUrlCookies[],
    @Cookies("Review_Video_Url_COOKIES")
    reviewVdoCookie: MediaUrlCookies[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewImgCookie.length || !reviewVdoCookie.length) {
      throw new NotFoundException(
        "이미지, 비디오 쿠키가 동시에 준비되어 있어야 합니다.",
      );
    }

    await this.promiseLbirary.twoPromiseBundle(
      this.reviewService.increaseStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithImageAndVideo({
        createReviewDto,
        jwtPayload,
        productId,
        reviewImgCookie,
        reviewVdoCookie,
      }),
      "StarRating And Create Review With Image And Video",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: ["Review_Image_Url_COOKIES", "Review_Video_Url_COOKIES"],
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/image")
  async createReviewWithImage(
    @Param("productId") productId: string,
    @Cookie("Review_Image_Url_COOKIES") reviewImgCookie: MediaUrlCookies[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewImgCookie.length) {
      throw new NotFoundException(
        "이미지 쿠키를 찾을 수 없습니다. 우선 사진을 업로드 해주세요.",
      );
    }

    await this.promiseLbirary.twoPromiseBundle(
      this.reviewService.increaseStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithImage({
        createReviewDto,
        jwtPayload,
        productId,
        reviewImgCookie,
      }),
      "StarRating And Create Review With Image",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: ["Review_Image_Url_COOKIES"],
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/video")
  async createReviewWithVideo(
    @Param("productId") productId: string,
    @Cookies("Review_Video_Url_COOKIES")
    reviewVdoCookie: MediaUrlCookies[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    if (!reviewVdoCookie.length) {
      throw new NotFoundException(
        "비디오 쿠키를 찾을 수 없습니다. 우선 동영상을 업로드 해주세요.",
      );
    }

    await this.promiseLbirary.twoPromiseBundle(
      this.reviewService.increaseStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithVideo({
        createReviewDto,
        jwtPayload,
        productId,
        reviewVdoCookie,
      }),
      "StarRating And Create Review With Video",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: ["Review_Video_Url_COOKIES"],
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
    await this.promiseLbirary.twoPromiseBundle(
      this.reviewService.increaseStarRating(createReviewDto, productId),
      this.reviewService.createReviewWithoutMedia({
        createReviewDto,
        jwtPayload,
        productId,
      }),
      "StarRating And Create Review Without Media",
    );

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId/image&video")
  async modifyReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Cookies("Review_Image_Url_COOKIES")
    reviewImgCookie: MediaUrlCookies[],
    @Cookies("Review_Video_Url_COOKIES")
    reviewVdoCookie: MediaUrlCookies[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
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

    await this.promiseLbirary.twoPromiseBundle(
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithImageAndVideo({
        modifyReviewDto,
        review,
        reviewImgCookie,
        reviewVdoCookie,
      }),
      "Modify Star Rating And Review with Image And Video",
    );

    return {
      status: 200,
      message: "리뷰를 수정하였습니다.",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId/image")
  async modifyReviewWithImage(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Cookies("Review_Video_Url_COOKIES")
    reviewImgCookie: MediaUrlCookies[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
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

    await this.promiseLbirary.twoPromiseBundle(
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithImage({
        modifyReviewDto,
        review,
        reviewImgCookie,
      }),
      "Modify Star Rating And Review with Image",
    );

    return {
      status: 200,
      message: "리뷰를 수정하였습니다.",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId/video")
  async modifyReviewWithVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Cookies("Review_Video_Url_COOKIES")
    reviewVdoCookie: MediaUrlCookies[],
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
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

    await this.promiseLbirary.twoPromiseBundle(
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithVideo({
        modifyReviewDto,
        review,
        reviewVdoCookie,
      }),
      "Modify Star Rating And Review with Video",
    );

    return {
      status: 200,
      message: "리뷰를 수정하였습니다.",
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

    await this.promiseLbirary.twoPromiseBundle(
      this.reviewService.modifyStarRating(modifyReviewDto, productId, review),
      this.reviewService.modifyReviewWithoutMedia({ modifyReviewDto, review }),
      "Modify Star Rating And Review Without Media",
    );

    return {
      statusCode: 200,
      message: "리뷰를 수정하였습니다.",
    };
  }
}
