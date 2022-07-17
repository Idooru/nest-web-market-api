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
import { UpdateReviewDto } from "../dto/update-review.dto";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt.payload.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { UseInterceptors } from "@nestjs/common";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json.clear.cookie.interceptor";
import { JsonClearCookieInterface } from "src/common/interfaces/json.clear.cookie.interface";
import { MediaUrlCookie } from "src/common/interfaces/media.url.cookie.interface";
import { StarRatingService } from "../providers/star-rating.service";
import { JsonGeneralInterface } from "src/common/interfaces/json.general.interface";
import { JsonGeneralInterceptor } from "../../../common/interceptors/json.general.interceptor";

@Controller("review")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly starRatingService: StarRatingService,
  ) {}

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Post("/product/:productName/image&video")
  async createReviewWithImageAndVideo(
    @Param("productName") productName: string,
    @Cookies("Review_Image_Url_COOKIES") reviewImgCookie: MediaUrlCookie[],
    @Cookies("Review_Video_Url_COOKIES") reviewVdoCookie: MediaUrlCookie[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface | JsonGeneralInterface<void>> {
    const { userSelectScore } = createReviewDto;
    const starRating = await this.starRatingService.putStarRating(
      userSelectScore,
      productName,
    );

    await this.starRatingService.calculateRating(starRating);

    await this.reviewService.createReviewWithImageAndVideo({
      createReviewDto,
      jwtPayload,
      productName,
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
  @Post("/product/:productName/image")
  async createReviewWithImage(
    @Param("productName") productName: string,
    @Cookies("Review_Image_Url_COOKIES") reviewImgCookie: MediaUrlCookie[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface | JsonGeneralInterface<void>> {
    const { userSelectScore } = createReviewDto;
    const starRating = await this.starRatingService.putStarRating(
      userSelectScore,
      productName,
    );

    await this.starRatingService.calculateRating(starRating);

    await this.reviewService.createReviewWithImage({
      createReviewDto,
      jwtPayload,
      productName,
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
  @Post("/product/:productName/video")
  async createReview(
    @Param("productName") productName: string,
    @Cookies("Review_Video_Url_COOKIES") reviewVdoCookie: MediaUrlCookie[],
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface | JsonGeneralInterface<void>> {
    const { userSelectScore } = createReviewDto;
    const starRating = await this.starRatingService.putStarRating(
      userSelectScore,
      productName,
    );

    await this.starRatingService.calculateRating(starRating);

    await this.reviewService.createReviewWithVideo({
      createReviewDto,
      jwtPayload,
      productName,
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
  @Post("/product/:productName")
  async createReviewWithoutMedia(
    @Param("productName") productName: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonClearCookieInterface | JsonGeneralInterface<void>> {
    const { userSelectScore } = createReviewDto;
    const starRating = await this.starRatingService.putStarRating(
      userSelectScore,
      productName,
    );

    await this.starRatingService.calculateRating(starRating);

    await this.reviewService.createReviewWithoutMedia({
      createReviewDto,
      jwtPayload,
      productName,
    });

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
    };
  }
}
