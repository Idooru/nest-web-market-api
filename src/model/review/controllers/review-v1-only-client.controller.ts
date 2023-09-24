import {
  Controller,
  Param,
  Body,
  UseGuards,
  Post,
  Put,
  Delete,
} from "@nestjs/common";
import { ReviewGeneralService } from "../services/review-general.service";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { UseInterceptors } from "@nestjs/common";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { StarRateGeneralService } from "../services/star-rate-general.service";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsClientGuard } from "src/common/guards/authenticate/is-client.guard";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";
import { ReviewDto } from "../dto/review.dto";
import { ReviewBundleService } from "../services/review-bundle.service";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { productVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/product-verify-cookie.key";
import { reviewMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReviewFunctionService } from "../services/review-function.service";

@ApiTags("v1 고객 Review API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-client/review")
export class ReviewVersionOneOnlyClientController {
  constructor(
    private readonly reviewFunctionService: ReviewFunctionService,
    private readonly reviewGeneralService: ReviewGeneralService,
    private readonly reviewBundleService: ReviewBundleService,
    private readonly starRateGeneralService: StarRateGeneralService,
  ) {}

  @ApiOperation({
    summary: "create review with image and video",
    description:
      "이미지와 비디오가 포함된 리뷰를 생성합니다. 이 api를 실행하기 전에 무조건 리뷰 이미지 혹은 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 리뷰 이미지, 비디오 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/image&video")
  async createReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewRequestDto: ReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewGeneralService.createReview({
      productId,
      reviewRequestDto,
      jwtPayload,
    });

    const mediaWork = () =>
      Promise.all([
        this.reviewFunctionService.insertReviewImage(review, reviewImgCookies),
        this.reviewFunctionService.insertReviewVideo(review, reviewVdoCookies),
      ]).then((res) => res.forEach((func) => func()));

    const starRateWork = () =>
      this.starRateGeneralService.starRating({
        reviewRequestDto,
        productId,
      });

    await Promise.all([mediaWork(), starRateWork()]);

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
    @Param("productId") productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @Body() reviewRequestDto: ReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewGeneralService.createReview({
      productId,
      reviewRequestDto,
      jwtPayload,
    });

    const mediaWork = () =>
      this.reviewFunctionService
        .insertReviewImage(review, reviewImgCookies)
        .then((res) => res());

    const starRateWork = () =>
      this.starRateGeneralService.starRating({ reviewRequestDto, productId });

    await Promise.all([mediaWork(), starRateWork()]);

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
    @Param("productId") productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewRequestDto: ReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewGeneralService.createReview({
      productId,
      reviewRequestDto,
      jwtPayload,
    });

    const mediaWork = () =>
      this.reviewFunctionService
        .insertReviewVideo(review, reviewVdoCookies)
        .then((res) => res());

    const starRateWork = () =>
      this.starRateGeneralService.starRating({ reviewRequestDto, productId });

    await Promise.all([mediaWork(), starRateWork()]);

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @ApiOperation({
    summary: "create review without media",
    description: "미디어 없이 리뷰를 생성합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId")
  async createReviewWithoutMedia(
    @Param("productId") productId: string,
    @Body() reviewRequestDto: ReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const createWork = () =>
      this.reviewGeneralService.createReview({
        productId,
        reviewRequestDto,
        jwtPayload,
      });

    const starRateWork = () =>
      this.starRateGeneralService.starRating({ reviewRequestDto, productId });

    await Promise.all([createWork(), starRateWork()]);

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
    };
  }

  @ApiOperation({
    summary: "modify review with image and video",
    description:
      "리뷰 아이디에 해당하는 이미지와 비디오가 포함된 리뷰를 수정합니다. 이 api를 실행하기 전에 무조건 리뷰 이미지 혹은 비디오를 하나 이상 업로드해야 합니다. 업로드 api를 호출할 때 생성된 리뷰 이미지, 비디오 쿠키를 사용합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      productVerifyCookieKey.is_exist.id_executed,
      productVerifyCookieKey.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId/image&video")
  async modifyReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewRequestDto: ReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = () =>
      Promise.all([
        this.reviewFunctionService.modifyReviewImage(review, reviewImgCookies),
        this.reviewFunctionService.modifyReviewVideo(review, reviewVdoCookies),
      ]).then((res) => res.forEach((func) => func()));

    const modifyWork = () =>
      Promise.all([
        this.starRateGeneralService.modifyStarRate({
          reviewRequestDto,
          productId,
          review,
        }),
        this.reviewGeneralService.modifyReview({
          reviewRequestDto,
          jwtPayload,
          beforeReview: review,
        }),
      ]);

    await Promise.all([mediaWork(), modifyWork()]);

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
  @UseGuards(
    new VerifyDataGuard(
      productVerifyCookieKey.is_exist.id_executed,
      productVerifyCookieKey.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId/image")
  async modifyReviewWithImage(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
    @Body() reviewRequestDto: ReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = () =>
      Promise.all([
        this.reviewFunctionService.modifyReviewImage(review, reviewImgCookies),
        this.reviewFunctionService.deleteReviewVideo(review.Video),
      ]).then((res) => res.forEach((func) => func()));

    const modifyWork = () =>
      Promise.all([
        this.starRateGeneralService.modifyStarRate({
          reviewRequestDto,
          productId,
          review,
        }),
        this.reviewGeneralService.modifyReview({
          reviewRequestDto,
          jwtPayload,
          beforeReview: review,
        }),
      ]);

    await Promise.all([mediaWork(), modifyWork()]);

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
  @UseGuards(
    new VerifyDataGuard(
      productVerifyCookieKey.is_exist.id_executed,
      productVerifyCookieKey.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId/video")
  async modifyReviewWithVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
    @Body() reviewRequestDto: ReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = () =>
      Promise.all([
        this.reviewFunctionService.modifyReviewVideo(review, reviewVdoCookies),
        this.reviewFunctionService.deleteReviewImage(review.Image),
      ]).then((res) => res.forEach((func) => func()));

    const modifyWork = () =>
      Promise.all([
        this.starRateGeneralService.modifyStarRate({
          reviewRequestDto,
          productId,
          review,
        }),
        this.reviewGeneralService.modifyReview({
          reviewRequestDto,
          jwtPayload,
          beforeReview: review,
        }),
      ]);

    await Promise.all([mediaWork(), modifyWork()]);

    return {
      statusCode: 200,
      message: `리뷰를 수정하였습니다. 해당 리뷰의 수정 횟수가 ${(review.countForModify += 1)}만큼 남았습니다.`,
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @ApiOperation({
    summary: "modify review without media",
    description:
      "리뷰 아이디에 해당하는 미디어가 포함되지 않은 리뷰를 수정합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      productVerifyCookieKey.is_exist.id_executed,
      productVerifyCookieKey.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId")
  async modifyReviewWithoutMedia(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @Body() reviewRequestDto: ReviewDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = () =>
      Promise.all([
        this.reviewFunctionService.deleteReviewImage(review.Image),
        this.reviewFunctionService.deleteReviewVideo(review.Video),
      ]).then((res) => res.forEach((func) => func()));

    const modifyWork = () =>
      Promise.all([
        this.starRateGeneralService.modifyStarRate({
          reviewRequestDto,
          productId,
          review,
        }),
        this.reviewGeneralService.modifyReview({
          reviewRequestDto,
          jwtPayload,
          beforeReview: review,
        }),
      ]);

    await Promise.all([mediaWork(), modifyWork()]);

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
  @Delete("/:reviewId")
  async deleteReview(
    @Param("reviewId") id: string,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      id,
      jwtPayload.userId,
    );

    await Promise.all([
      this.reviewGeneralService.deleteReview(review),
      this.starRateGeneralService.decreaseStarRate(review),
    ]);

    return {
      statusCode: 200,
      message: "리뷰를 삭제하였습니다.",
    };
  }
}
