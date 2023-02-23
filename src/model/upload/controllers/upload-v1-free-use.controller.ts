import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from "@nestjs/common";

import {
  maxContentsCount,
  MulterConfig,
} from "src/common/config/multer.config";
import { FilesInterceptor } from "@nestjs/platform-express";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { MeidaLoggerLibrary } from "src/common/lib/media-logger.library";
import { mediaCookieKeys } from "src/common/config/cookie-key-configs";
import { UploadGeneralService } from "../services/upload-general.service";
import { JsonSendCookiesInterceptor } from "src/common/interceptors/general/json-send-cookies.interceptor";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonSendCookiesInterface } from "src/common/interceptors/general/interface/json-send-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JsonClearCookiesInterface } from "src/common/interceptors/general/interface/json-clear-cookies.interface";
import { ReturnMediaDto } from "../dto/return-media.dto";
import { ReceiveMediaDto } from "../dto/receive-media.dto";

@Controller("/api/v1/free-use/upload")
export class UploadVersionOneFreeUseController {
  constructor(
    private readonly uploadGeneralService: UploadGeneralService,
    private readonly mediaLoggerLibrary: MeidaLoggerLibrary,
  ) {
    MulterConfig.createFolder("image", "video");
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "review_image",
      maxContentsCount,
      MulterConfig.upload("/image/review"),
    ),
  )
  @UseGuards(IsLoginGuard)
  @Post("/review/image")
  async uploadReviewImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<ReturnMediaDto>> {
    this.uploadGeneralService.isExistMediaFile("review image", files);
    this.mediaLoggerLibrary.log("review images", null, files);

    await this.uploadGeneralService.uploadReviewImage(files, jwtPayload);

    const cookieValues = files.map((file) => ({
      whatCookie: mediaCookieKeys.review.image_url_cookie,
      url: this.uploadGeneralService.setUrl(file.filename),
      fileName: file.filename,
    }));

    return {
      statusCode: 201,
      message: "리뷰 사진을 업로드 하였습니다.",
      cookieKey: mediaCookieKeys.review.image_url_cookie,
      cookieValues,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "review_video",
      maxContentsCount,
      MulterConfig.upload("video/review"),
    ),
  )
  @UseGuards(IsLoginGuard)
  @Post("/review/video")
  async uploadReviewVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<ReturnMediaDto>> {
    this.uploadGeneralService.isExistMediaFile("review video", files);
    this.mediaLoggerLibrary.log("review videos", null, files);

    await this.uploadGeneralService.uploadReviewVideo(files, jwtPayload);

    const cookieValues = files.map((file) => ({
      whatCookie: mediaCookieKeys.review.image_url_cookie,
      url: this.uploadGeneralService.setUrl(file.filename),
      fileName: file.filename,
    }));

    return {
      statusCode: 201,
      message: "리뷰 동영상을 업로드 하였습니다.",
      cookieKey: mediaCookieKeys.review.video_url_cookie,
      cookieValues,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "inquiry_image",
      maxContentsCount,
      MulterConfig.upload("image/inquiry"),
    ),
  )
  @UseGuards(IsLoginGuard)
  @Post("/inquiry/image")
  async uploadInquiryImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<ReturnMediaDto>> {
    this.uploadGeneralService.isExistMediaFile("inquiry image", files);
    this.mediaLoggerLibrary.log("inquiry images", null, files);

    await this.uploadGeneralService.uploadInquiryImage(files, jwtPayload);

    const cookieValues = files.map((file) => ({
      whatCookie: mediaCookieKeys.review.image_url_cookie,
      url: this.uploadGeneralService.setUrl(file.filename),
      fileName: file.filename,
    }));

    return {
      statusCode: 201,
      message: "문의 사진을 업로드 하였습니다.",
      cookieKey: mediaCookieKeys.inquiry.image_url_cookie,
      cookieValues,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "inquiry_video",
      maxContentsCount,
      MulterConfig.upload("video/inquiry"),
    ),
  )
  @UseGuards(IsLoginGuard)
  @Post("/inquiry/video")
  async uploadInquiryVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<ReturnMediaDto>> {
    this.uploadGeneralService.isExistMediaFile("inquiry video", files);
    this.mediaLoggerLibrary.log("inquiry videos", null, files);

    await this.uploadGeneralService.uploadInquiryVideo(files, jwtPayload);

    const cookieValues = files.map((file) => ({
      whatCookie: mediaCookieKeys.review.image_url_cookie,
      url: this.uploadGeneralService.setUrl(file.filename),
      fileName: file.filename,
    }));

    return {
      statusCode: 201,
      message: "문의 동영상을 업로드 하였습니다.",
      cookieKey: mediaCookieKeys.inquiry.video_url_cookie,
      cookieValues,
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/review/image")
  async cancelImageUploadForReview(
    @Cookies(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookies: ReceiveMediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.uploadGeneralService.deleteReviewImages(reviewImgCookies);

    return {
      statusCode: 200,
      message: "리뷰 사진 업로드를 취소하였습니다.",
      cookieKey: reviewImgCookies.map((cookie) => cookie.whatCookie),
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/review/video")
  async cancelVideoUploadForReview(
    @Cookies(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookies: ReceiveMediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.uploadGeneralService.deleteReviewVideos(reviewVdoCookies);

    return {
      statusCode: 200,
      message: "리뷰 동영상 업로드를 취소하였습니다.",
      cookieKey: reviewVdoCookies.map((cookie) => cookie.whatCookie),
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/inquiry/image")
  async cancelImageUploadForInquiry(
    @Cookies(mediaCookieKeys.inquiry.image_url_cookie)
    inquiryImgCookies: ReceiveMediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.uploadGeneralService.deleteInquiryImages(inquiryImgCookies);

    return {
      statusCode: 200,
      message: "문의 사진 업로드를 취소하였습니다.",
      cookieKey: inquiryImgCookies.map((cookie) => cookie.whatCookie),
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/inquiry/video")
  async cancelVideoUploadForInquiry(
    @Cookies(mediaCookieKeys.inquiry.video_url_cookie)
    inquiryVdoCookies: ReceiveMediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.uploadGeneralService.deleteInquiryVideos(inquiryVdoCookies);

    return {
      statusCode: 200,
      message: "문의 동영상 업로드를 취소하였습니다.",
      cookieKey: inquiryVdoCookies.map((cookie) => cookie.whatCookie),
    };
  }
}
