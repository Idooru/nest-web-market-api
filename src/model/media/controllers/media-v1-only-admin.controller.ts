import {
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { MulterConfigService } from "src/common/config/multer.config";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { FilesInterceptor } from "@nestjs/platform-express";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { MediaGeneralService } from "../services/media-general.service";
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
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";

@ApiTags("v1 관리자 Media API")
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

  @ApiOperation({
    summary: "find uploaded product image",
    description:
      "업로드된 상품 이미지를 가져옵니다. 상품 이미지를 가져올 때는 쿠키에 기재된 정보를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/product/image")
  async findUploadedProductImage(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @MediaCookiesParser(productMediaCookieKey.image_url_cookie)
    productImgCookies: MediaDto[],
  ): Promise<JsonGeneralInterface<ProductImageEntity[]>> {
    const productImages = await this.mediaAccessoryService.findProductImages(
      productImgCookies,
    );

    const uploadedProductImages =
      await this.mediaGeneralService.findUploadedProductImages(
        jwtPayload.email,
        productImages,
      );

    return {
      statusCode: 200,
      message: "현재 업로드된 상품 이미지를 가져옵니다.",
      result: uploadedProductImages,
    };
  }

  @ApiOperation({
    summary: "find uploaded inquiry response images",
    description:
      "업로드된 문의 응답 이미지를 가져옵니다. 문의 응답 이미지를 가져올 때는 쿠키에 기재된 정보를 사용합니다.",
  })
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

  @ApiOperation({
    summary: "find uploaded inquiry response videos",
    description:
      "업로드된 문의 응답 비디오를 가져옵니다. 문의 응답 비디오를 가져올 때는 쿠키에 기재된 정보를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry/response/video")
  async findUploadedInquiryResponseVideos(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
    @MediaCookiesParser(inquiryMediaCookieKey.response.video_url_cookie)
    inquiryResponseVdoCookies: MediaDto[],
  ): Promise<JsonGeneralInterface<InquiryResponseVideoEntity[]>> {
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

  @ApiOperation({
    summary: "upload product image",
    description:
      "상품 이미지를 업로드합니다. 상품 이미지는 api를 호출할 때 하나씩만 업로드가 가능합니다. 업로드된 상품 이미지는 쿠키에 기재되어 다른 api에서 사용이 가능합니다.",
  })
  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "product_image",
      MulterConfigService.maxContentsCount,
      MulterConfigService.upload("/images/product"),
    ),
  )
  @Post("/product/image")
  async uploadProductImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookiesInterface<MediaDto>> {
    this.mediaAccessoryService.isExistMediaFiles("product image", files);
    this.mediaLoggerLibrary.log("product image", files);

    const urls = files.map((file) =>
      this.mediaAccessoryService.setUrl(file.filename, "product/images"),
    );

    await this.mediaGeneralService.uploadProductsImage(files, jwtPayload, urls);

    const cookieValues = this.mediaAccessoryService.createMediaCookieValues(
      this.productMedia.image_url_cookie,
      files,
      urls,
    );

    return {
      statusCode: 201,
      message: "상품 사진을 업로드 하였습니다.",
      cookieKey: this.productMedia.image_url_cookie,
      cookieValues,
    };
  }

  @ApiOperation({
    summary: "upload inquiry response image",
    description:
      "문의 응답 이미지를 업로드합니다. 문의 응답 이미지는 api를 호출할 때 최대 5개 업로드가 가능합니다. 업로드된 문의 응답 이미지는 쿠키에 기재되어 다른 api에서 사용이 가능합니다.",
  })
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
    this.mediaAccessoryService.isExistMediaFiles(
      "inquiry response image",
      files,
    );
    this.mediaLoggerLibrary.log("inquiry response images", files);

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

  @ApiOperation({
    summary: "upload inquiry response video",
    description:
      "문의 응답 비디오를 업로드합니다. 문의 응답 비디오는 api를 호출할 때 최대 5개 업로드가 가능합니다. 업로드된 문의 응답 비디오는 쿠키에 기재되어 다른 api에서 사용이 가능합니다.",
  })
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
    this.mediaAccessoryService.isExistMediaFiles(
      "inquiry response video",
      files,
    );
    this.mediaLoggerLibrary.log("inquiry response video", files);

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

  @ApiOperation({
    summary: "cancel product image upload",
    description:
      "상품 이미지 업로드를 취소합니다. 클라이언트에 저장되어 있던 상품 이미지 쿠키를 제거합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/product/image")
  async cancelImageUploadForProduct(
    @MediaCookiesParser(productMediaCookieKey.image_url_cookie)
    productImgCookies: MediaDto[],
  ): Promise<JsonClearCookiesInterface> {
    await this.mediaGeneralService.deleteProductImageWithCookies(
      productImgCookies,
    );

    this.mediaBundleService.deleteMediaFile(
      productImgCookies,
      "images/product",
    );

    const cookieKey = productImgCookies.map((cookie) => cookie.whatCookie);

    return {
      statusCode: 200,
      message: "상품 사진 업로드를 취소하였습니다.",
      cookieKey,
    };
  }

  @ApiOperation({
    summary: "cancel inquiry response image upload",
    description:
      "문의 응답 이미지 업로드를 취소합니다. 클라이언트에 저장되어 있던 문의 응답 이미지 쿠키를 제거합니다.",
  })
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

  @ApiOperation({
    summary: "cancel inquiry response video upload",
    description:
      "문의 응답 비디오 업로드를 취소합니다. 클라이언트에 저장되어 있던 문의 응답 비디오 쿠키를 제거합니다.",
  })
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
