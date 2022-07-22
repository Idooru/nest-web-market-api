import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
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

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/image&video")
  async createReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @Cookies("Review_Image_Url_COOKIES") reviewImgCookie: MediaUrlCookie[],
    @Cookies("Review_Video_Url_COOKIES") reviewVdoCookie: MediaUrlCookie[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface> {
    if (!reviewImgCookie.length || !reviewVdoCookie.length) {
      throw new NotFoundException(
        "이미지, 비디오 쿠키를 찾을 수 없습니다. 우선 사진과 동영상을 업로드 해주세요.",
      );
    }

    await this.reviewService.starRating(createReviewDto, productId);

    await this.reviewService.createReviewWithImageAndVideo({
      createReviewDto,
      jwtPayload,
      productId,
      reviewImgCookie,
      reviewVdoCookie,
    });

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
    @Cookies("Review_Image_Url_COOKIES") reviewImgCookie: MediaUrlCookie[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface> {
    if (!reviewImgCookie.length) {
      throw new NotFoundException(
        "이미지 쿠키를 찾을 수 없습니다. 우선 사진을 업로드 해주세요.",
      );
    }

    await this.reviewService.starRating(createReviewDto, productId);

    await this.reviewService.createReviewWithImage({
      createReviewDto,
      jwtPayload,
      productId,
      reviewImgCookie,
    });

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: ["Review_Image_Url_COOKIES"],
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productId/video")
  async createReview(
    @Param("productId") productId: string,
    @Cookies("Review_Video_Url_COOKIES") reviewVdoCookie: MediaUrlCookie[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface> {
    if (!reviewVdoCookie.length) {
      throw new NotFoundException(
        "비디오 쿠키를 찾을 수 없습니다. 우선 동영상을 업로드 해주세요.",
      );
    }

    await this.reviewService.starRating(createReviewDto, productId);

    await this.reviewService.createReviewWithVideo({
      createReviewDto,
      jwtPayload,
      productId,
      reviewVdoCookie,
    });

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
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.reviewService.starRating(createReviewDto, productId);

    await this.reviewService.createReviewWithoutMedia({
      createReviewDto,
      jwtPayload,
      productId,
    });

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/product/:productId/review/:reviewId")
  async modifyReveiwWithoutMedia(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Body() modifyReviewDto: ModifyReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<void> {
    await this.reviewService.starRating(modifyReviewDto, productId);
    await this.reviewService.selfAuthForModifyReview(
      reviewId,
      jwtPayload.userId,
    );

    // await this.reviewService.modifyReviewWithoutMedia(
    //   modifyReviewDto,
    //   jwtPayload,
    //   productId,
    // );
  }
}
