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
import { ReviewRequestDto } from "../dto/review-request.dto";
import { ReviewBundleService } from "../services/review-bundle.service";
import { MediaDto } from "src/model/media/dto/media.dto";
import { productVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/product-verify-cookie.key";
import { reviewMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("v1 고객 Review API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-client/review")
export class ReviewVersionOneOnlyClientController {
  constructor(
    private readonly reviewGeneralService: ReviewGeneralService,
    private readonly reviewBundleService: ReviewBundleService,
    private readonly starRateGeneralService: StarRateGeneralService,
  ) {}

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/image&video")
  async createReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaDto[],
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewGeneralService.createReview({
      productId,
      reviewRequestDto,
      jwtPayload,
    });

    const mediaWork = async () => {
      await this.reviewBundleService.pushReviewMedia({
        reviewRequestDto,
        reviewImgCookies,
        reviewVdoCookies,
      });

      await this.reviewBundleService.insertReviewMedia({
        reviewImgCookies,
        reviewVdoCookies,
        reviewRequestDto,
        review,
      });
    };

    await Promise.all([
      mediaWork(),
      this.starRateGeneralService.starRating({ reviewRequestDto, productId }),
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
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/image")
  async createReviewWithImage(
    @Param("productId") productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewGeneralService.createReview({
      productId,
      reviewRequestDto,
      jwtPayload,
    });

    const mediaWork = async () => {
      await this.reviewBundleService.pushReviewMedia({
        reviewRequestDto,
        reviewImgCookies,
      });

      await this.reviewBundleService.insertReviewMedia({
        reviewImgCookies,
        reviewRequestDto,
        review,
      });
    };

    await Promise.all([
      mediaWork(),
      this.starRateGeneralService.starRating({ reviewRequestDto, productId }),
    ]);

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId/video")
  async createReviewWithVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewGeneralService.createReview({
      productId,
      reviewRequestDto,
      jwtPayload,
    });

    const mediaWork = async () => {
      await this.reviewBundleService.pushReviewMedia({
        reviewRequestDto,
        reviewVdoCookies,
      });

      await this.reviewBundleService.insertReviewMedia({
        reviewVdoCookies,
        reviewRequestDto,
        review,
      });
    };

    await Promise.all([
      mediaWork(),
      this.starRateGeneralService.starRating({ reviewRequestDto, productId }),
    ]);

    return {
      statusCode: 201,
      message: "리뷰를 생성하였습니다.",
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(productVerifyCookieKey.is_exist.id_executed))
  @Post("/product/:productId")
  async createReviewWithoutMedia(
    @Param("productId") productId: string,
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await Promise.all([
      this.starRateGeneralService.starRating({ reviewRequestDto, productId }),
      this.reviewGeneralService.createReview({
        productId,
        reviewRequestDto,
        jwtPayload,
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
      productVerifyCookieKey.is_exist.id_executed,
      productVerifyCookieKey.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId/image&video")
  async modifyReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaDto[],
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = async () => {
      await this.reviewBundleService.pushReviewMedia({
        reviewRequestDto,
        reviewImgCookies,
        reviewVdoCookies,
      });
      await this.reviewBundleService.modifyReviewMedia({
        review,
        reviewRequestDto,
        reviewImgCookies,
        reviewVdoCookies,
      });
      await this.reviewBundleService.deleteReviewMedia(review);
    };

    await Promise.all([
      mediaWork(),
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

    return {
      statusCode: 200,
      message: `리뷰를 수정하였습니다. 해당 리뷰의 수정 횟수가 ${(review.countForModify += 1)}만큼 남았습니다.`,
      cookieKey: [
        ...reviewImgCookies.map((cookie) => cookie.whatCookie),
        ...reviewVdoCookies.map((cookie) => cookie.whatCookie),
      ],
    };
  }

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
    reviewImgCookies: MediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = async () => {
      await this.reviewBundleService.pushReviewMedia({
        reviewRequestDto,
        reviewImgCookies,
      });
      await this.reviewBundleService.modifyReviewMedia({
        reviewImgCookies,
        reviewRequestDto,
        review,
      });
      await this.reviewBundleService.deleteReviewMedia(review);
    };

    await Promise.all([
      mediaWork(),
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

    return {
      statusCode: 200,
      message: `리뷰를 수정하였습니다. 해당 리뷰의 수정 횟수가 ${(review.countForModify += 1)}만큼 남았습니다.`,
      cookieKey: [...reviewImgCookies.map((cookie) => cookie.whatCookie)],
    };
  }

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
    reviewVdoCookies: MediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = async () => {
      await this.reviewBundleService.pushReviewMedia({
        reviewRequestDto,
        reviewVdoCookies,
      });
      await this.reviewBundleService.modifyReviewMedia({
        reviewVdoCookies,
        reviewRequestDto,
        review,
      });
      await this.reviewBundleService.deleteReviewMedia(review);
    };

    await Promise.all([
      mediaWork(),
      this.starRateGeneralService.modifyStarRate({
        reviewRequestDto,
        productId,
        review,
      }),
      await this.reviewGeneralService.modifyReview({
        reviewRequestDto,
        jwtPayload,
        beforeReview: review,
      }),
    ]);

    return {
      statusCode: 200,
      message: `리뷰를 수정하였습니다. 해당 리뷰의 수정 횟수가 ${(review.countForModify += 1)}만큼 남았습니다.`,
      cookieKey: [...reviewVdoCookies.map((cookie) => cookie.whatCookie)],
    };
  }

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
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    await Promise.all([
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
      this.reviewBundleService.deleteReviewMedia(review),
    ]);

    return {
      statusCode: 200,
      message: `리뷰를 수정하였습니다. 해당 리뷰의 수정 횟수가 ${(review.countForModify += 1)}만큼 남았습니다.`,
    };
  }

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
      this.reviewBundleService.deleteReviewMedia(review),
      this.starRateGeneralService.decreaseStarRate(review),
    ]);

    return {
      statusCode: 200,
      message: "리뷰를 삭제하였습니다.",
    };
  }
}
