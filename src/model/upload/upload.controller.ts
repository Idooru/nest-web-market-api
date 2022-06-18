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
import { UploadService } from "./upload.service";
import { ImageReturnDto } from "./dto/image-return.dto";
import { IsAdminGuard } from "src/common/guards/isAdmin.guard";
import { IsLoginGuard } from "src/common/guards/isLogin.guard";
import { MulterProvider } from "src/model/upload/multer.provider";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { GetDecodedJwt } from "src/common/decorators/get-decoded-jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { JSON } from "../../common/interfaces/json.interface";
import { Response } from "express";
import { CookieOption } from "src/common/config/etc";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @UseInterceptors(
    FileInterceptor("image", new MulterProvider().apply("image", "video")),
  )
  @Post("/image-for-product")
  async uploadImgForProduct(
    @UploadedFile() file: Express.Multer.File,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ): Promise<JSON<ImageReturnDto>> {
    console.log("logging image info ->\n", file);

    const result = await this.uploadService.uploadImgForProduct(
      file,
      jwtPayload,
    );

    res.cookie("imageUrl", result.url, CookieOption);

    return {
      statusCode: 201,
      message: "사진을 업로드 하였습니다.",
      result,
    };
  }

  @UseGuards(IsLoginGuard)
  // @UseInterceptors(FilesInterceptor("video", new MulterProvider().apply()))
  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUploadDto: ImageReturnDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.uploadService.remove(+id);
  }
}
