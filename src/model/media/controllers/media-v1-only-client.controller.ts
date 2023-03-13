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
import { MeidaLoggerLibrary } from "src/common/lib/media-logger.library";
import { mediaCookieKeys } from "src/common/config/cookie-key-configs";
import { JsonSendCookiesInterceptor } from "src/common/interceptors/general/json-send-cookies.interceptor";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonSendCookiesInterface } from "src/common/interceptors/general/interface/json-send-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JsonClearCookiesInterface } from "src/common/interceptors/general/interface/json-clear-cookies.interface";
import { ReturnMediaDto } from "../dto/return-media.dto";
import { ReceiveMediaDto } from "../dto/receive-media.dto";
import { MediaGeneralService } from "../services/media-general.service";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsClientGuard } from "src/common/guards/authenticate/is-client.guard";
import { MediaRedundantService } from "../services/media-redundant.service";

@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-client/media")
export class MediaVersionOneOnlyClientController {
  constructor(
    private readonly mediaGeneralService: MediaGeneralService,
    private readonly mediaRedundantService: MediaRedundantService,
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
  @Post("/review/image")
  async uploadReviewImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<ReturnMediaDto>> {
    this.mediaRedundantService.isExistMediaFile("review image", files);
    this.mediaLoggerLibrary.log("review images", null, files);

    await this.mediaGeneralService.uploadReviewImage(files, jwtPayload);

    const cookieValues = this.mediaGeneralService.createMediaCookieValues(
      mediaCookieKeys.review.image_url_cookie,
      files,
    );

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
  @Post("/review/video")
  async uploadReviewVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<ReturnMediaDto>> {
    this.mediaRedundantService.isExistMediaFile("review video", files);
    this.mediaLoggerLibrary.log("review videos", null, files);

    await this.mediaGeneralService.uploadReviewVideo(files, jwtPayload);

    const cookieValues = this.mediaGeneralService.createMediaCookieValues(
      mediaCookieKeys.review.video_url_cookie,
      files,
    );

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
  @Post("/inquiry/image")
  async uploadInquiryImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<ReturnMediaDto>> {
    this.mediaRedundantService.isExistMediaFile("inquiry image", files);
    this.mediaLoggerLibrary.log("inquiry images", null, files);

    await this.mediaGeneralService.uploadInquiryImage(files, jwtPayload);

    const cookieValues = this.mediaGeneralService.createMediaCookieValues(
      mediaCookieKeys.inquiry.image_url_cookie,
      files,
    );

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
  @Post("/inquiry/video")
  async uploadInquiryVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<ReturnMediaDto>> {
    this.mediaRedundantService.isExistMediaFile("inquiry video", files);
    this.mediaLoggerLibrary.log("inquiry videos", null, files);

    await this.mediaGeneralService.uploadInquiryVideo(files, jwtPayload);

    const cookieValues = this.mediaGeneralService.createMediaCookieValues(
      mediaCookieKeys.inquiry.video_url_cookie,
      files,
    );

    return {
      statusCode: 201,
      message: "문의 동영상을 업로드 하였습니다.",
      cookieKey: mediaCookieKeys.inquiry.video_url_cookie,
      cookieValues,
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/review/image")
  async cancelImageUploadForReview(
    @MediaCookiesParser(mediaCookieKeys.review.image_url_cookie)
    reviewImgCookies: ReceiveMediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.mediaGeneralService.deleteReviewImages(reviewImgCookies);
    const cookieKey = reviewImgCookies.map((cookie) => cookie.whatCookie);

    return {
      statusCode: 200,
      message: "리뷰 사진 업로드를 취소하였습니다.",
      cookieKey,
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/review/video")
  async cancelVideoUploadForReview(
    @MediaCookiesParser(mediaCookieKeys.review.video_url_cookie)
    reviewVdoCookies: ReceiveMediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.mediaGeneralService.deleteReviewVideos(reviewVdoCookies);
    const cookieKey = reviewVdoCookies.map((cookie) => cookie.whatCookie);

    return {
      statusCode: 200,
      message: "리뷰 동영상 업로드를 취소하였습니다.",
      cookieKey,
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/inquiry/image")
  async cancelImageUploadForInquiry(
    @MediaCookiesParser(mediaCookieKeys.inquiry.image_url_cookie)
    inquiryImgCookies: ReceiveMediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.mediaGeneralService.deleteInquiryImages(inquiryImgCookies);
    const cookieKey = inquiryImgCookies.map((cookie) => cookie.whatCookie);

    return {
      statusCode: 200,
      message: "문의 사진 업로드를 취소하였습니다.",
      cookieKey,
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/inquiry/video")
  async cancelVideoUploadForInquiry(
    @MediaCookiesParser(mediaCookieKeys.inquiry.video_url_cookie)
    inquiryVdoCookies: ReceiveMediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.mediaGeneralService.deleteInquiryVideos(inquiryVdoCookies);
    const cookieKey = inquiryVdoCookies.map((cookie) => cookie.whatCookie);

    return {
      statusCode: 200,
      message: "문의 동영상 업로드를 취소하였습니다.",
      cookieKey,
    };
  }
}
