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
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { MediaReceiveDto } from "../dto/media-receive.dto";
import { MeidaLoggerLibrary } from "src/common/lib/media-logger.library";
import { FileInterceptor } from "@nestjs/platform-express";
import { mediaCookieKeys } from "../../../common/config/cookie-key-configs";
import { Cookie } from "src/common/decorators/cookie.decorator";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { UploadGeneralService } from "../services/upload-general.service";
import { JsonSendCookieInterceptor } from "src/common/interceptors/general/json-send-cookie.interceptor";
import { JsonSendCookieInterface } from "src/common/interceptors/general/interface/json-send-cookie.interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/general/json-clear-cookie.interceptor";
import { JsonClearCookieInterface } from "src/common/interceptors/general/interface/json-clear-cookie.interface";
import { MediaReturnDto } from "../dto/media-return.dto";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/upload")
export class UploadVersionOneOnlyAdminController {
  constructor(
    private readonly uploadGeneralService: UploadGeneralService,
    private readonly mediaLoggerLibrary: MeidaLoggerLibrary,
  ) {}

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(
    FileInterceptor("product_image", MulterConfig.upload("/image/product")),
  )
  @Post("/product/image")
  async uploadOneMedia(
    @UploadedFile() file: Express.Multer.File,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonSendCookieInterface<MediaReturnDto>> {
    this.uploadGeneralService.isExistMediaFile("product image", file);
    this.mediaLoggerLibrary.log("product image", file, null);

    await this.uploadGeneralService.uploadProductImage(file, jwtPayload);

    const cookieValue = {
      whatCookie: mediaCookieKeys.product.image_url_cookie,
      url: this.uploadGeneralService.setUrl(file.filename),
      fileName: file.filename,
    };

    return {
      statusCode: 201,
      message: "상품 사진을 업로드 하였습니다.",
      cookieKey: mediaCookieKeys.product.image_url_cookie,
      cookieValue,
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @Delete("/product/image")
  async cancelImageUploadForProduct(
    @Cookie(mediaCookieKeys.product.image_url_cookie)
    productImgCookie: MediaReceiveDto,
  ): Promise<JsonClearCookieInterface> {
    await this.uploadGeneralService.deleteProductImage(productImgCookie);

    return {
      statusCode: 200,
      message: "상품 사진 업로드를 취소하였습니다.",
      cookieKey: "product_image_url_cookie",
    };
  }
}
