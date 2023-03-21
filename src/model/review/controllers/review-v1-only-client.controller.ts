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
import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import {
  mediaCookieKeys,
  verifyCookieKeys,
} from "src/common/config/cookie-key-configs";
import { JsonClearCookiesInterface } from "src/common/interceptors/general/interface/json-clear-cookies.interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/general/interface/json-general-interface";
import { StarRateGeneralService } from "../services/star-rate-general.service";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsClientGuard } from "src/common/guards/authenticate/is-client.guard";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";
import { ReviewRequestDto } from "../dto/review-request.dto";
import { ReviewBundleService } from "../services/review-bundle.service";

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
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/image&video")
  async createReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookies: RequestMediaDto[],
    @MediaCookiesParser(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookies: RequestMediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await Promise.all([
      this.starRateGeneralService.starRating({ reviewRequestDto, productId }),
      this.reviewBundleService.pushMedia({
        reviewRequestDto,
        reviewImgCookies,
        reviewVdoCookies,
      }),
    ]);

    const review = await this.reviewGeneralService.createReview({
      productId,
      reviewRequestDto,
      jwtPayload,
    });

    await this.reviewBundleService.insertMedia({
      reviewImgCookies,
      reviewVdoCookies,
      reviewRequestDto,
      review,
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

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.product.is_exist.id_executed))
  @Post("/product/:productId/image")
  async createReviewWithImage(
    @Param("productId") productId: string,
    @MediaCookiesParser(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookies: RequestMediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await Promise.all([
      this.starRateGeneralService.starRating({ reviewRequestDto, productId }),
      this.reviewBundleService.pushMedia({
        reviewRequestDto,
        reviewImgCookies,
      }),
    ]);

    const review = await this.reviewGeneralService.createReview({
      productId,
      reviewRequestDto,
      jwtPayload,
    });

    await this.reviewBundleService.insertMedia({
      reviewImgCookies,
      reviewRequestDto,
      review,
    });

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
    reviewVdoCookies: RequestMediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    await Promise.all([
      this.starRateGeneralService.starRating({ reviewRequestDto, productId }),
      this.reviewBundleService.pushMedia({
        reviewRequestDto,
        reviewVdoCookies,
      }),
    ]);

    const review = await this.reviewGeneralService.createReview({
      productId,
      reviewRequestDto,
      jwtPayload,
    });

    await this.reviewBundleService.insertMedia({
      reviewVdoCookies,
      reviewRequestDto,
      review,
    });

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
      verifyCookieKeys.review.is_exist.id_executed,
      verifyCookieKeys.product.is_exist.id_executed,
    ),
  )
  @Put("/:reviewId/product/:productId/image&video")
  async modifyReviewWithImageAndVideo(
    @Param("productId") productId: string,
    @Param("reviewId") reviewId: string,
    @MediaCookiesParser(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookies: RequestMediaDto[],
    @MediaCookiesParser(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookies: RequestMediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = async () => {
      await this.reviewBundleService.pushMedia({
        reviewRequestDto,
        reviewImgCookies,
        reviewVdoCookies,
      });
      await this.reviewBundleService.modifyMedia({
        review,
        reviewRequestDto,
        reviewImgCookies,
        reviewVdoCookies,
      });
      await this.reviewBundleService.deleteMediaIfItHad(review);
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
    reviewImgCookies: RequestMediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = async () => {
      await this.reviewBundleService.pushMedia({
        reviewRequestDto,
        reviewImgCookies,
      });
      await this.reviewBundleService.modifyMedia({
        reviewImgCookies,
        reviewRequestDto,
        review,
      });
      await this.reviewBundleService.deleteMediaIfItHad(review);
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
    reviewVdoCookies: RequestMediaDto[],
    @Body() reviewRequestDto: ReviewRequestDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookiesInterface> {
    const review = await this.reviewBundleService.distinguishOwnReview(
      reviewId,
      jwtPayload.userId,
    );

    this.reviewBundleService.checkModifyCount(review);

    const mediaWork = async () => {
      await this.reviewBundleService.pushMedia({
        reviewRequestDto,
        reviewVdoCookies,
      });
      await this.reviewBundleService.modifyMedia({
        reviewVdoCookies,
        reviewRequestDto,
        review,
      });
      await this.reviewBundleService.deleteMediaIfItHad(review);
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
      this.reviewBundleService.deleteMediaIfItHad(review),
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
    const review = await this.reviewBundleService.distinguishOwnReview(
      id,
      jwtPayload.userId,
    );

    await Promise.all([
      this.reviewGeneralService.deleteReview(review),
      this.reviewBundleService.deleteMediaIfItHad(review),
      this.starRateGeneralService.decreaseStarRate(review),
    ]);

    return {
      statusCode: 200,
      message: "리뷰를 삭제하였습니다.",
    };
  }
}
