import {
  Controller,
  Delete,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  maxContentsCount,
  MulterConfig,
} from "src/common/config/multer.config";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MeidaLoggerLibrary } from "src/common/lib/media-logger.library";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { mediaCookieKeys } from "../../../common/config/cookie-key-configs";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonSendCookieInterceptor } from "src/common/interceptors/general/json-send-cookie.interceptor";
import { JsonSendCookieInterface } from "src/common/interceptors/general/interface/json-send-cookie.interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/general/json-clear-cookie.interceptor";
import { JsonClearCookieInterface } from "src/common/interceptors/general/interface/json-clear-cookie.interface";
import { MediaGeneralService } from "../services/media-general.service";
import { MediaCookieParser } from "src/common/decorators/media-cookie-parser.decorator";
import { MediaAccessoryService } from "../services/media-accessory.service";
import { JsonSendCookiesInterface } from "src/common/interceptors/general/interface/json-send-cookies.interface";
import { JsonSendCookiesInterceptor } from "src/common/interceptors/general/json-send-cookies.interceptor";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { MediaBundleService } from "../services/media-bundle.service";
import { JsonClearCookiesInterface } from "src/common/interceptors/general/interface/json-clear-cookies.interface";
import { MediaDto } from "../dto/media.dto";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/media")
export class MediaVersionOneOnlyAdminController {
  constructor(
    private readonly mediaGeneralService: MediaGeneralService,
    private readonly mediaAccessoryService: MediaAccessoryService,
    private readonly mediaBundleService: MediaBundleService,
    private readonly mediaLoggerLibrary: MeidaLoggerLibrary,
  ) {}

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(
    FileInterceptor("product_image", MulterConfig.upload("/image/product")),
  )
  @Post("/product/image")
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookieInterface<MediaDto>> {
    this.mediaAccessoryService.isExistMediaFile("product image", file);
    this.mediaLoggerLibrary.log("product image", file, null);

    await this.mediaGeneralService.uploadProductImage(file, jwtPayload);

    const cookieValue = this.mediaAccessoryService.createMediaCookieValue(
      mediaCookieKeys.product.image_url_cookie,
      file,
    );

    return {
      statusCode: 201,
      message: "상품 사진을 업로드 하였습니다.",
      cookieKey: mediaCookieKeys.product.image_url_cookie,
      cookieValue,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "inquiry_response_image",
      maxContentsCount,
      MulterConfig.upload("image/inquiry/response"),
    ),
  )
  @Post("/inquiry/response/image")
  async uploadInquiryResponseImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<MediaDto>> {
    this.mediaAccessoryService.isExistMediaFile(
      "inquiry response image",
      files,
    );
    this.mediaLoggerLibrary.log("inquiry response images", null, files);

    const urls = files.map((file) =>
      this.mediaAccessoryService.setUrl(file.filename),
    );

    await this.mediaGeneralService.uploadInquiryResponseImage(
      files,
      jwtPayload,
      urls,
    );

    const cookieValues = this.mediaAccessoryService.createMediaCookieValues(
      mediaCookieKeys.inquiry.response.image_url_cookie,
      files,
      urls,
    );

    return {
      statusCode: 201,
      message: "문의 응답 사진을 업로드 하였습니다.",
      cookieKey: mediaCookieKeys.inquiry.response.image_url_cookie,
      cookieValues,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "inquiry_response_video",
      maxContentsCount,
      MulterConfig.upload("video/inquiry/response"),
    ),
  )
  @Post("/inquiry/response/video")
  async uploadInquiryResponseVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<MediaDto>> {
    this.mediaAccessoryService.isExistMediaFile(
      "inquiry response video",
      files,
    );
    this.mediaLoggerLibrary.log("inquiry response video", null, files);

    const urls = files.map((file) =>
      this.mediaAccessoryService.setUrl(file.filename),
    );

    await this.mediaGeneralService.uploadInquiryResponseVideo(
      files,
      jwtPayload,
      urls,
    );

    const cookieValues = this.mediaAccessoryService.createMediaCookieValues(
      mediaCookieKeys.inquiry.response.video_url_cookie,
      files,
      urls,
    );

    return {
      statusCode: 201,
      message: "문의 응답 동영상을 업로드 하였습니다.",
      cookieKey: mediaCookieKeys.inquiry.response.video_url_cookie,
      cookieValues,
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(JsonClearCookieInterceptor)
  @Delete("/product/image")
  async cancelImageUploadForProduct(
    @MediaCookieParser(mediaCookieKeys.product.image_url_cookie)
    productImgCookie: MediaDto,
  ): Promise<JsonClearCookieInterface> {
    await this.mediaGeneralService.deleteProductImageWithCookies(
      productImgCookie,
    );

    this.mediaBundleService.deleteMediaFile(
      [productImgCookie],
      "image/product",
    );

    return {
      statusCode: 200,
      message: "상품 사진 업로드를 취소하였습니다.",
      cookieKey: productImgCookie.whatCookie,
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/inquiry/response/image")
  async cancelInquiryResponseImageUpload(
    @MediaCookiesParser(mediaCookieKeys.inquiry.response.image_url_cookie)
    inquiryResponseImgCookies: MediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.mediaGeneralService.deleteInquiryResponseImagesWithCookies(
      inquiryResponseImgCookies,
    );

    this.mediaBundleService.deleteMediaFile(
      inquiryResponseImgCookies,
      "image/inquiry/response",
    );

    const cookieKey = inquiryResponseImgCookies.map(
      (cookie) => cookie.whatCookie,
    );

    return {
      statusCode: 200,
      message: "문의 응답 사진 업로드를 취소하였습니다.",
      cookieKey,
    };
  }

  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/inquiry/response/video")
  async cancelInquiryResponseVideoUpload(
    @MediaCookiesParser(mediaCookieKeys.inquiry.response.video_url_cookie)
    inquiryResponseVdoCookies: MediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.mediaGeneralService.deleteInquiryResponseVideosWithCookies(
      inquiryResponseVdoCookies,
    );

    this.mediaBundleService.deleteMediaFile(
      inquiryResponseVdoCookies,
      "video/inquiry/response",
    );

    const cookieKey = inquiryResponseVdoCookies.map(
      (cookie) => cookie.whatCookie,
    );

    return {
      statusCode: 200,
      message: "문의 응답 동영상 업로드를 취소하였습니다.",
      cookieKey,
    };
  }
}
