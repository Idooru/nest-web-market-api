import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from "@nestjs/common";
import { UploadService } from "../../upload/services/upload.service";
import { ImageReturnDto } from "../../upload/dto/image-return.dto";
import { IsLoginGuard } from "src/common/guards/isLogin.guard";
import { MulterConfig } from "src/common/config/multer.config";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetDecodedJwt } from "src/common/decorators/get-decoded-jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { JSON } from "../../../common/interfaces/json-success.interface";
import { Response } from "express";
import { CookieOption } from "src/common/config/etc";
import { ProductImageCookieKey } from "./../../../common/config/etc";
import { IsAdmin } from "src/common/decorators/isAdmin.decorator";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {
    MulterConfig.createFolder("video", "image");
  }

  @UseGuards(IsLoginGuard)
  @UseInterceptors(FileInterceptor("image", MulterConfig.upload("image")))
  @Post("/image-for-product")
  async uploadImgForProduct(
    @IsAdmin()
    @UploadedFile()
    file: Express.Multer.File,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ): Promise<JSON<ImageReturnDto>> {
    console.log("logging image info ->\n", file);

    const result = await this.uploadService.uploadImgForProduct(
      file,
      jwtPayload,
    );

    res.cookie(ProductImageCookieKey, result.url, CookieOption);

    return {
      statusCode: 201,
      message: "사진을 업로드 하였습니다.",
      result,
    };
  }

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
