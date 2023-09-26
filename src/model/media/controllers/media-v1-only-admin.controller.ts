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
import { JsonSendCookiesInterface } from "src/common/interceptors/interface/json-send-cookies.interface";
import { JsonSendCookiesInterceptor } from "src/common/interceptors/general/json-send-cookies.interceptor";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { MediaCookieDto } from "../dto/media-cookie.dto";
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
import { ProductImagesValidatePipe } from "../pipe/exist/product-images-validate.pipe";
import { MediaOperationService } from "../services/media-operation.service";
import { InquiryResponseImageValidatePipe } from "../pipe/exist/inquiry-response-image-validate.pipe";
import { MediaSearcher } from "../logic/media.searcher";
import { InquiryResponseVideoValidatePipe } from "../pipe/exist/inquiry-response-video-validate.pipe";

@ApiTags("v1 관리자 Media API")
@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/media")
export class MediaVersionOneOnlyAdminController {
  constructor(
    private readonly mediaSearcher: MediaSearcher,
    private readonly mediaOperationService: MediaOperationService,
    @Inject("ProductMediaCookieKey")
    private readonly productMedia: ProductMediaCookieKey,
    @Inject("InquiryMediaCookieKey")
    private readonly inquiryMedia: InquiryMediaCookieKey,
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
    productImgCookies: MediaCookieDto[],
  ): Promise<JsonGeneralInterface<ProductImageEntity[]>> {
    const result = await this.mediaSearcher.findProductImagesWithId(
      productImgCookies,
    );

    return {
      statusCode: 200,
      message: "현재 업로드된 상품 이미지를 가져옵니다.",
      result,
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
    inquiryResponseImgCookies: MediaCookieDto[],
  ): Promise<JsonGeneralInterface<InquiryResponseImageEntity[]>> {
    const result = await this.mediaSearcher.findInquiryResponseImagesWithId(
      inquiryResponseImgCookies,
    );

    return {
      statusCode: 200,
      message: "현재 업로드된 문의 응답 이미지를 가져옵니다.",
      result,
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
    inquiryResponseVdoCookies: MediaCookieDto[],
  ): Promise<JsonGeneralInterface<InquiryResponseVideoEntity[]>> {
    const result = await this.mediaSearcher.findInquiryResponseVideosWithId(
      inquiryResponseVdoCookies,
    );

    return {
      statusCode: 200,
      message: "현재 업로드된 문의 응답 동영상을 가져옵니다.",
      result,
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
    @UploadedFiles(ProductImagesValidatePipe)
    files: Express.Multer.File[],
  ): Promise<JsonSendCookiesInterface<MediaCookieDto>> {
    const cookieValues = await this.mediaOperationService.uploadProductImages(
      files,
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
    @UploadedFiles(InquiryResponseImageValidatePipe)
    files: Express.Multer.File[],
  ): Promise<JsonSendCookiesInterface<MediaCookieDto>> {
    const cookieValues =
      await this.mediaOperationService.uploadInquiryResponseImages(files);

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
    @UploadedFiles(InquiryResponseVideoValidatePipe)
    files: Array<Express.Multer.File>,
  ): Promise<JsonSendCookiesInterface<MediaCookieDto>> {
    const cookieValues =
      await this.mediaOperationService.uploadInquiryResponseVideos(files);

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
    productImgCookies: MediaCookieDto[],
  ): Promise<JsonClearCookiesInterface> {
    const cookieKey =
      await this.mediaOperationService.deleteProductImagesWithId(
        productImgCookies,
      );

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
    inquiryResponseImgCookies: MediaCookieDto[],
  ): Promise<JsonClearCookiesInterface> {
    const cookieKey =
      await this.mediaOperationService.deleteInquiryResponseImagesWithId(
        inquiryResponseImgCookies,
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
    inquiryResponseVdoCookies: MediaCookieDto[],
  ): Promise<JsonClearCookiesInterface> {
    const cookieKey =
      await this.mediaOperationService.deleteInquiryResponseVideosWithId(
        inquiryResponseVdoCookies,
      );

    return {
      statusCode: 200,
      message: "문의 응답 동영상 업로드를 취소하였습니다.",
      cookieKey,
    };
  }
}
