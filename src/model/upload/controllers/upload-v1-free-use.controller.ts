import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from "@nestjs/common";
import { JsonClearCookieInterface } from "../../../common/interceptors/interface/json-clear-cookie.interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json-clear-cookie.interceptor";
import { UploadService } from "../providers/upload.service";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { MulterConfig } from "src/common/config/multer.config";
import { FilesInterceptor } from "@nestjs/platform-express";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { JsonSendCookieInterface } from "../../../common/interceptors/interface/json-send-cookie.interface";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { JsonSendCookieInterceptor } from "src/common/interceptors/json-send-cookie.interceptor";
import { MediaUrlCookie } from "src/model/upload/media.url.cookie.interface";
import { MeidaLoggerLibrary } from "src/common/lib/media-logger.library";

@Controller("/api/v1/free-use/upload")
export class UploadVersionOneFreeUseController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly mediaLoggerLibrary: MeidaLoggerLibrary,
  ) {
    MulterConfig.createFolder("image", "video");
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(
    FilesInterceptor("review_image", 3, MulterConfig.upload("image/review")),
  )
  @UseGuards(IsLoginGuard)
  @Post("/image/review")
  async uploadReviewImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookieInterface<string[][]>> {
    this.mediaLoggerLibrary.log("review images", null, files);
    this.uploadService.checkExtensionTypeForImages(files);

    const image = await this.uploadService.uploadReviewImage(files, jwtPayload);
    const reviewImages = image.map((idx) => [idx.name, idx.url]);

    return {
      statusCode: 201,
      message: "리뷰 사진을 업로드 하였습니다.",
      cookieKey: "review_image_url_cookies",
      cookieValue: reviewImages,
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(
    FilesInterceptor("review_video", 3, MulterConfig.upload("video/review")),
  )
  @UseGuards(IsLoginGuard)
  @Post("/video/review")
  async uploadReviewVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookieInterface<string[][]>> {
    this.mediaLoggerLibrary.log("review videos", null, files);
    this.uploadService.checkExtensionTypeForVideos(files);

    const video = await this.uploadService.uploadReviewVideo(files, jwtPayload);
    const reviewVideos = video.map((idx) => [idx.name, idx.url]);

    return {
      statusCode: 201,
      message: "리뷰 동영상을 업로드 하였습니다.",
      cookieKey: "review_video_url_cookies",
      cookieValue: reviewVideos,
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(
    FilesInterceptor("inquiry_image", 3, MulterConfig.upload("image/inquiry")),
  )
  @UseGuards(IsLoginGuard)
  @Post("/image/inquiry")
  async uploadInquiryImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookieInterface<string[][]>> {
    this.mediaLoggerLibrary.log("inquiry images", null, files);
    this.uploadService.checkExtensionTypeForImages(files);

    const image = await this.uploadService.uploadInquiryImage(
      files,
      jwtPayload,
    );
    const inquiryImages = image.map((idx) => [idx.name, idx.url]);

    return {
      statusCode: 201,
      message: "문의 사진을 업로드 하였습니다.",
      cookieKey: "inquiry_image_url_cookies",
      cookieValue: inquiryImages,
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(
    FilesInterceptor("inquiry_video", 3, MulterConfig.upload("video/inquiry")),
  )
  @UseGuards(IsLoginGuard)
  @Post("/video/inquiry")
  async uploadInquiryVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookieInterface<string[][]>> {
    this.mediaLoggerLibrary.log("inquiry videos", null, files);
    this.uploadService.checkExtensionTypeForVideos(files);

    const video = await this.uploadService.uploadInquiryVideo(
      files,
      jwtPayload,
    );
    const InquiryVideos = video.map((idx) => [idx.name, idx.url]);

    return {
      statusCode: 201,
      message: "문의 동영상을 업로드 하였습니다.",
      cookieKey: "Inquiry_Video_Url_COOKIES",
      cookieValue: InquiryVideos,
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/image/review/cancel")
  async cancelImageUploadForReview(
    @Cookies("review_image_url_cookies") reviewImgCookie: MediaUrlCookie[],
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteReviewImages(reviewImgCookie);

    return {
      statusCode: 200,
      message: "리뷰 사진 업로드를 취소하였습니다.",
      cookieKey: "review_image_url_cookies",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/video/review/cancel")
  async cancelVideoUploadForReview(
    @Cookies("review_video_url_cookies") reviewVdoCookie: MediaUrlCookie[],
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteReviewVideos(reviewVdoCookie);

    return {
      statusCode: 200,
      message: "리뷰 동영상 업로드를 취소하였습니다.",
      cookieKey: "review_video_url_cookies",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/image/inquiry/cancel")
  async cancelImageUploadForInquiry(
    @Cookies("inquiry_image_url_COOKIES") inquiryImgCookie: MediaUrlCookie[],
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteInquiryImages(inquiryImgCookie);

    return {
      statusCode: 200,
      message: "문의 사진 업로드를 취소하였습니다.",
      cookieKey: "inquiry_image_url_cookies",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/video/inquiry/cancel")
  async cancelVideoUploadForInquiry(
    @Cookies("Inquiry_Video_Url_COOKIES") InquiryVdoCookie: MediaUrlCookie[],
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteInquiryVideos(InquiryVdoCookie);

    return {
      statusCode: 200,
      message: "문의 동영상 업로드를 취소하였습니다.",
      cookieKey: "Inquiry_Video_Url_COOKIES",
    };
  }
}
