import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from "@nestjs/common";

import { UploadService } from "../providers/upload.service";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { MulterConfig } from "src/common/config/multer.config";
import { FilesInterceptor } from "@nestjs/platform-express";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { JsonSendCookiesInterface } from "src/common/interceptors/interface/json-send-cookies.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { JsonSendCookiesInterceptor } from "src/common/interceptors/json-send-cookies.interceptor";
import { MeidaLoggerLibrary } from "src/common/lib/media-logger.library";
import { MediaUrlCookieValue } from "../media.url.cookies.interface";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/json-clear-cookies.interceptor";
import { CookieLibrary } from "src/common/lib/cookie.library";

@Controller("/api/v1/free-use/upload")
export class UploadVersionOneFreeUseController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly mediaLoggerLibrary: MeidaLoggerLibrary,
    private readonly cookieLibrary: CookieLibrary,
  ) {
    MulterConfig.createFolder("image", "video");
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor("review_image", 3, MulterConfig.upload("/image/review")),
  )
  @UseGuards(IsLoginGuard)
  @Post("/image/review")
  async uploadReviewImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<MediaUrlCookieValue>> {
    this.uploadService.isExistMediaFiles("review image", files);
    this.mediaLoggerLibrary.log("review images", null, files);

    const reviewImages = await this.uploadService.uploadReviewImage(
      files,
      jwtPayload,
    );

    const cookieKey = "review_image_url_cookie";

    const extendedReviewImages =
      this.cookieLibrary.insertNumberOnContinuousCookies(
        reviewImages,
        cookieKey,
      );

    return {
      statusCode: 201,
      message: "리뷰 사진을 업로드 하였습니다.",
      cookieKey,
      cookieValue: extendedReviewImages,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor("review_video", 3, MulterConfig.upload("video/review")),
  )
  @UseGuards(IsLoginGuard)
  @Post("/video/review")
  async uploadReviewVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<MediaUrlCookieValue>> {
    this.uploadService.isExistMediaFiles("review video", files);
    this.mediaLoggerLibrary.log("review videos", null, files);

    const reviewVideos = await this.uploadService.uploadReviewVideo(
      files,
      jwtPayload,
    );

    const cookieKey = "review_video_url_cookie";

    const extendedReviewVideos =
      this.cookieLibrary.insertNumberOnContinuousCookies(
        reviewVideos,
        cookieKey,
      );

    return {
      statusCode: 201,
      message: "리뷰 동영상을 업로드 하였습니다.",
      cookieKey,
      cookieValue: extendedReviewVideos,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor("inquiry_image", 3, MulterConfig.upload("image/inquiry")),
  )
  @UseGuards(IsLoginGuard)
  @Post("/image/inquiry")
  async uploadInquiryImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<MediaUrlCookieValue>> {
    this.uploadService.isExistMediaFiles("inquiry image", files);
    this.mediaLoggerLibrary.log("inquiry images", null, files);

    const inquiryImages = await this.uploadService.uploadInquiryImage(
      files,
      jwtPayload,
    );

    const cookieKey = "inquiry_image_url_cookies";

    const extendedInquiryImages =
      this.cookieLibrary.insertNumberOnContinuousCookies(
        inquiryImages,
        cookieKey,
      );

    return {
      statusCode: 201,
      message: "문의 사진을 업로드 하였습니다.",
      cookieKey,
      cookieValue: extendedInquiryImages,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor("inquiry_video", 3, MulterConfig.upload("video/inquiry")),
  )
  @UseGuards(IsLoginGuard)
  @Post("/video/inquiry")
  async uploadInquiryVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<MediaUrlCookieValue>> {
    this.uploadService.isExistMediaFiles("inquiry video", files);
    this.mediaLoggerLibrary.log("inquiry videos", null, files);

    const inquiryVideos = await this.uploadService.uploadInquiryVideo(
      files,
      jwtPayload,
    );

    const cookieKey = "inquiry_video_url_cookie";

    const extendedInquiryVideos =
      this.cookieLibrary.insertNumberOnContinuousCookies(
        inquiryVideos,
        cookieKey,
      );

    return {
      statusCode: 201,
      message: "문의 동영상을 업로드 하였습니다.",
      cookieKey,
      cookieValue: extendedInquiryVideos,
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/image/review/cancel")
  async cancelImageUploadForReview(
    @Cookies("review_image_url_cookie")
    reviewImgCookies: MediaUrlCookieValue[],
  ): Promise<JsonClearCookiesInterface> {
    await this.uploadService.deleteReviewImages(reviewImgCookies);

    return {
      statusCode: 200,
      message: "리뷰 사진 업로드를 취소하였습니다.",
      cookieKey: reviewImgCookies.map((cookie) => cookie.whatCookie),
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/video/review/cancel")
  async cancelVideoUploadForReview(
    @Cookies("review_video_url_cookie")
    reviewVdoCookies: MediaUrlCookieValue[],
  ): Promise<JsonClearCookiesInterface> {
    await this.uploadService.deleteReviewVideos(reviewVdoCookies);

    return {
      statusCode: 200,
      message: "리뷰 동영상 업로드를 취소하였습니다.",
      cookieKey: reviewVdoCookies.map((cookie) => cookie.whatCookie),
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/image/inquiry/cancel")
  async cancelImageUploadForInquiry(
    @Cookies("inquiry_image_url_cookie")
    inquiryImgCookies: MediaUrlCookieValue[],
  ): Promise<JsonClearCookiesInterface> {
    await this.uploadService.deleteInquiryImages(inquiryImgCookies);

    return {
      statusCode: 200,
      message: "문의 사진 업로드를 취소하였습니다.",
      cookieKey: inquiryImgCookies.map((cookie) => cookie.whatCookie),
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/video/inquiry/cancel")
  async cancelVideoUploadForInquiry(
    @Cookies("inquiry_video_url_cookie")
    inquiryVdoCookies: MediaUrlCookieValue[],
  ): Promise<JsonClearCookiesInterface> {
    await this.uploadService.deleteInquiryVideos(inquiryVdoCookies);

    return {
      statusCode: 200,
      message: "문의 동영상 업로드를 취소하였습니다.",
      cookieKey: inquiryVdoCookies.map((cookie) => cookie.whatCookie),
    };
  }
}
