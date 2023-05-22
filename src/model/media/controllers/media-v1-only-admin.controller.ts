import {
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { MulterConfigService } from "src/common/config/multer.config";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonSendCookieInterceptor } from "src/common/interceptors/general/json-send-cookie.interceptor";
import { JsonSendCookieInterface } from "src/common/interceptors/interface/json-send-cookie.interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/general/json-clear-cookie.interceptor";
import { JsonClearCookieInterface } from "src/common/interceptors/interface/json-clear-cookie.interface";
import { MediaGeneralService } from "../services/media-general.service";
import { MediaCookieParser } from "src/common/decorators/media-cookie-parser.decorator";
import { MediaAccessoryService } from "../services/media-accessory.service";
import { JsonSendCookiesInterface } from "src/common/interceptors/interface/json-send-cookies.interface";
import { JsonSendCookiesInterceptor } from "src/common/interceptors/general/json-send-cookies.interceptor";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { MediaBundleService } from "../services/media-bundle.service";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { MediaDto } from "../dto/media.dto";
import { MeidaLoggerLibrary } from "src/common/lib/logger/media-logger.library";
import {
  InquiryMediaCookieKey,
  inquiryMediaCookieKey,
} from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import {
  ProductMediaCookieKey,
  productMediaCookieKey,
} from "src/common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { ProductImageEntity } from "../entities/product-image.entity";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/media")
export class MediaVersionOneOnlyAdminController {
  constructor(
    @Inject("ProductMediaCookieKey")
    private readonly productMedia: ProductMediaCookieKey,
    @Inject("InquiryMediaCookieKey")
    private readonly inquiryMedia: InquiryMediaCookieKey,
    private readonly mediaGeneralService: MediaGeneralService,
    private readonly mediaAccessoryService: MediaAccessoryService,
    private readonly mediaBundleService: MediaBundleService,
    private readonly mediaLoggerLibrary: MeidaLoggerLibrary,
  ) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/product/image")
  async findUploadedProductImage(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @MediaCookieParser(productMediaCookieKey.image_url_cookie)
    productImgCookie: MediaDto,
  ): Promise<JsonGeneralInterface<ProductImageEntity>> {
    const uploadedProductImage =
      await this.mediaGeneralService.findUploadedProductImage(
        jwtPayload.email,
        productImgCookie.url,
      );

    return {
      statusCode: 200,
      message: "현재 업로드된 상품 이미지를 가져옵니다.",
      result: uploadedProductImage,
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry/response/image")
  async findUploadedInquiryResponseImages(
    @GetJWT() jwtPaylaod: JwtAccessTokenPayload,
    @MediaCookiesParser(inquiryMediaCookieKey.response.image_url_cookie)
    inquiryResponseImgCookies: MediaDto[],
  ): Promise<JsonGeneralInterface<InquiryResponseImageEntity[]>> {
    const inquiryResponseImages =
      await this.mediaAccessoryService.findInquiryResponseImages(
        inquiryResponseImgCookies,
      );

    const uploadedInquiryResponseImages =
      await this.mediaGeneralService.findUploadedInquiryResponseImages(
        jwtPaylaod.email,
        inquiryResponseImages,
      );

    return {
      statusCode: 200,
      message: "현재 업로드된 문의 응답 이미지를 가져옵니다.",
      result: uploadedInquiryResponseImages,
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry/response/video")
  async findUploadedInquiryResponseVideos(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @MediaCookiesParser(inquiryMediaCookieKey.response.video_url_cookie)
    inquiryResponseVdoCookies: MediaDto[],
  ): Promise<any> {
    const inquiryResponseVideos =
      await this.mediaAccessoryService.findInquiryResponseVideos(
        inquiryResponseVdoCookies,
      );

    const uploadedInquiryResponseVideos =
      await this.mediaGeneralService.findUploadedInquiryResponseVideos(
        jwtPayload.email,
        inquiryResponseVideos,
      );

    return {
      statusCode: 200,
      message: "현재 업로드된 문의 응답 동영상을 가져옵니다.",
      result: uploadedInquiryResponseVideos,
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(
    FileInterceptor(
      "product_image",
      MulterConfigService.upload("/images/product"),
    ),
  )
  @Post("/product/image")
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookieInterface<MediaDto>> {
    this.mediaAccessoryService.isExistMediaFile("product image", file);
    this.mediaLoggerLibrary.log("product image", file, null);

    const url = this.mediaAccessoryService.setUrl(
      file.filename,
      "product/images",
    );

    await this.mediaGeneralService.uploadProductImage(jwtPayload, url);

    const cookieValue = this.mediaAccessoryService.createMediaCookieValue(
      this.productMedia.image_url_cookie,
      file,
      url,
    );

    return {
      statusCode: 201,
      message: "상품 사진을 업로드 하였습니다.",
      cookieKey: this.productMedia.image_url_cookie,
      cookieValue,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "inquiry_response_image",
      MulterConfigService.maxContentsCount,
      MulterConfigService.upload("images/inquiry/response"),
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
      this.mediaAccessoryService.setUrl(
        file.filename,
        "inquiry/response/images",
      ),
    );

    await this.mediaGeneralService.uploadInquiryResponseImage(
      files,
      jwtPayload,
      urls,
    );

    const cookieValues = this.mediaAccessoryService.createMediaCookieValues(
      this.inquiryMedia.response.image_url_cookie,
      files,
      urls,
    );

    return {
      statusCode: 201,
      message: "문의 응답 사진을 업로드 하였습니다.",
      cookieKey: this.inquiryMedia.response.image_url_cookie,
      cookieValues,
    };
  }

  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "inquiry_response_video",
      MulterConfigService.maxContentsCount,
      MulterConfigService.upload("videos/inquiry/response"),
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
      this.mediaAccessoryService.setUrl(
        file.filename,
        "inquiry/response/videos",
      ),
    );

    await this.mediaGeneralService.uploadInquiryResponseVideo(
      files,
      jwtPayload,
      urls,
    );

    const cookieValues = this.mediaAccessoryService.createMediaCookieValues(
      this.inquiryMedia.response.video_url_cookie,
      files,
      urls,
    );

    return {
      statusCode: 201,
      message: "문의 응답 동영상을 업로드 하였습니다.",
      cookieKey: this.inquiryMedia.response.video_url_cookie,
      cookieValues,
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @Delete("/product/image")
  async cancelImageUploadForProduct(
    @MediaCookieParser(productMediaCookieKey.image_url_cookie)
    productImgCookie: MediaDto,
  ): Promise<JsonClearCookieInterface> {
    await this.mediaGeneralService.deleteProductImageWithCookies(
      productImgCookie,
    );

    this.mediaBundleService.deleteMediaFile(
      [productImgCookie],
      "images/product",
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
    @MediaCookiesParser(inquiryMediaCookieKey.response.image_url_cookie)
    inquiryResponseImgCookies: MediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.mediaGeneralService.deleteInquiryResponseImagesWithCookies(
      inquiryResponseImgCookies,
    );

    this.mediaBundleService.deleteMediaFile(
      inquiryResponseImgCookies,
      "images/inquiry/response",
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
    @MediaCookiesParser(inquiryMediaCookieKey.response.video_url_cookie)
    inquiryResponseVdoCookies: MediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.mediaGeneralService.deleteInquiryResponseVideosWithCookies(
      inquiryResponseVdoCookies,
    );

    this.mediaBundleService.deleteMediaFile(
      inquiryResponseVdoCookies,
      "videos/inquiry/response",
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
