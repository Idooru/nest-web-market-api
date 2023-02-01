import {
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { MulterConfig } from "src/common/config/multer.config";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JsonSendCookieInterface } from "src/common/interceptors/interface/json-send-cookie.interface";
import { JsonSendCookieInterceptor } from "src/common/interceptors/json-send-cookie.interceptor";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaUrlCookie } from "../media.url.cookie.interface";
import { UploadService } from "../providers/upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json-clear-cookie.interceptor";
import { IsLoginGuard } from "src/common/guards/is-login.guard";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { JsonClearCookieInterface } from "src/common/interceptors/interface/json-clear-cookie.interface";
import { IsAdminGuard } from "src/common/guards/is-admin.guard";
import { MeidaLoggerLibrary } from "src/common/lib/media-logger.library";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/upload")
export class UploadVersionOneOnlyAdminController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly mediaLoggerLibrary: MeidaLoggerLibrary,
  ) {}

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(
    FileInterceptor("product_image", MulterConfig.upload("/image/product")),
  )
  @Post("/image/product")
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookieInterface<MediaUrlCookie>> {
    this.uploadService.isExistMediaFile("product image", file);
    this.mediaLoggerLibrary.log("product image", file, null);
    this.uploadService.checkExtensionTypeForProductImage(file);

    const image = await this.uploadService.uploadProductImage(file, jwtPayload);

    return {
      statusCode: 201,
      message: "상품 사진을 업로드 하였습니다.",
      cookieKey: "product_image_url_cookie",
      cookieValue: { name: image.name, url: image.url },
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @Delete("/image/product/cancel")
  async cancelImageUploadForProduct(
    @Cookies("product_image_url_cookie")
    productImgCookie: MediaUrlCookie,
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteProductImage(productImgCookie);

    return {
      statusCode: 200,
      message: "상품 사진 업로드를 취소하였습니다.",
      cookieKey: "product_image_url_cookie",
    };
  }
}
