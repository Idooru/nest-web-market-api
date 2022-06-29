import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  UploadedFiles,
} from "@nestjs/common";
import {
  CookieOption,
  VideoCookieKey,
  ProductImageCookieKey,
} from "src/common/config/etc";
import { UploadService } from "../../upload/services/upload.service";
import { ImageReturnDto } from "../../upload/dto/image-return.dto";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { MulterConfig } from "src/common/config/multer.config";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { GetDecodedJwt } from "src/common/decorators/get-decoded-jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { JSON } from "../../../common/interfaces/json-success.interface";
import { IsAdminGuard } from "../../../common/guards/is-admin.guard";
import { Response } from "express";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {
    MulterConfig.createFolder("video", "image");
  }

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @UseInterceptors(FileInterceptor("image", MulterConfig.upload("image")))
  @Post("/image/product")
  async uploadImageForProduct(
    @UploadedFile() file: Express.Multer.File,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ): Promise<JSON<ImageReturnDto>> {
    console.log("logging image info ->\n", file);

    const result = await this.uploadService.uploadImageForProduct(
      file,
      jwtPayload,
    );

    res.cookie(ProductImageCookieKey, result.url, CookieOption);

    return {
      statusCode: 201,
      message: "상품 사진을 업로드 하였습니다.",
      result,
    };
  }

  // @UseGuards(IsLoginGuard)
  // @UseInterceptors(FilesInterceptor("video", 3, MulterConfig.upload("video")))
  // @Post("/video")
  // async uploadVideo(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @GetDecodedJwt() jwtPayload: JwtPayload,
  //   @Res() res: Response,
  // ) {
  //   console.log("logging video info ->\n", files);

  //   const result = await this.uploadService.uploadVideo(files, jwtPayload);

  //   // res.cookie(VideoCookieKey, result.url, CookieOption);

  //   return {
  //     statusCode: 201,
  //     message: "리뷰 동영상을 업로드 하였습니다.",
  //     result,
  //   };
  // }

  // @UseGuards(IsLoginGuard)
  // // @UseInterceptors(FilesInterceptor("video", new MulterProvider().apply()))
  // @Get()
  // findAll() {
  //   return this.uploadService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.uploadService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateUploadDto: ImageReturnDto) {
  //   return this.uploadService.update(+id, updateUploadDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.uploadService.remove(+id);
  // }
}
