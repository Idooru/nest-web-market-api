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
import { RequestMediaDto } from "../dto/request-media.dto";
import { MeidaLoggerLibrary } from "src/common/lib/media-logger.library";
import { FileInterceptor } from "@nestjs/platform-express";
import { mediaCookieKeys } from "../../../common/config/cookie-key-configs";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonSendCookieInterceptor } from "src/common/interceptors/general/json-send-cookie.interceptor";
import { JsonSendCookieInterface } from "src/common/interceptors/general/interface/json-send-cookie.interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/general/json-clear-cookie.interceptor";
import { JsonClearCookieInterface } from "src/common/interceptors/general/interface/json-clear-cookie.interface";
import { ResponseMediaDto } from "../dto/response-media.dto";
import { MediaGeneralService } from "../services/media-general.service";
import { MediaCookieParser } from "src/common/decorators/media-cookie-parser.decorator";
import { MediaAccessoryService } from "../services/media-accessory.service";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/media")
export class MediaVersionOneOnlyAdminController {
  constructor(
    private readonly mediaGeneralService: MediaGeneralService,
    private readonly mediaAccessoryService: MediaAccessoryService,
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
  ): Promise<JsonSendCookieInterface<ResponseMediaDto>> {
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

  @UseInterceptors(JsonClearCookieInterceptor)
  @Delete("/product/image")
  async cancelImageUploadForProduct(
    @MediaCookieParser(mediaCookieKeys.product.image_url_cookie)
    productImgCookie: RequestMediaDto,
  ): Promise<JsonClearCookieInterface> {
    await this.mediaGeneralService.deleteProductImageWithCookies(
      productImgCookie,
    );

    this.mediaAccessoryService.deleteMediaFilesOnServerDisk(
      productImgCookie.fileName,
      "image/product",
    );

    return {
      statusCode: 200,
      message: "상품 사진 업로드를 취소하였습니다.",
      cookieKey: "product_image_url_cookie",
    };
  }
}
