import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  UploadedFiles,
  Delete,
} from "@nestjs/common";
import { CookieOption } from "../../../common/config/etc/etc.variable";
import { UploadService } from "../providers/upload.service";
import { MediaReturnDto } from "../dto/media-return.dto";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { MulterConfig } from "src/common/config/multer.config";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { GetDecodedJwt } from "src/common/decorators/get-decoded-jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { JSON } from "../../../common/interfaces/json-success.interface";
import { IsAdminGuard } from "../../../common/guards/is-admin.guard";
import { Response } from "express";
import { Cookies } from "src/common/decorators/cookies.decorator";

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
  ): Promise<JSON<MediaReturnDto>> {
    console.log("logging image info ->\n", file);

    const result = await this.uploadService.uploadImageForProduct(
      file,
      jwtPayload,
    );

    if (result.uploadReason === "product image") {
      res.cookie("productImageUrl", result.url, CookieOption);
    }

    return {
      statusCode: 201,
      message: "상품 사진을 업로드 하였습니다.",
      result,
    };
  }

  @UseGuards(IsLoginGuard)
  @UseInterceptors(FilesInterceptor("image", 3, MulterConfig.upload("image")))
  @Post("/image/review")
  async uploadImageForReview(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ) {
    console.log("logging video info ->\n", files);

    const image = await this.uploadService.uploadImage(files, jwtPayload);
    const urls = image.map((idx) => idx.url);

    res.cookie("reviewImageUrl", urls, CookieOption);

    return {
      statusCode: 201,
      message: "리뷰 사진을 업로드 하였습니다.",
      result: image,
    };
  }

  @UseGuards(IsLoginGuard)
  @UseInterceptors(FilesInterceptor("video", 3, MulterConfig.upload("video")))
  @Post("/video/review")
  async uploadVideoForReview(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ) {
    console.log("logging video info ->\n", files);

    const video = await this.uploadService.uploadVideo(files, jwtPayload);
    const urls = video.map((idx) => idx.url);

    res.cookie("reviewVideoUrl", urls, CookieOption);

    return {
      statusCode: 201,
      message: "리뷰 동영상을 업로드 하였습니다.",
      result: video,
    };
  }

  @UseGuards(IsLoginGuard)
  @UseInterceptors(FilesInterceptor("image", 3, MulterConfig.upload("image")))
  @Post("/image/inquiry")
  async uploadImageForInquiry(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ) {
    console.log("logging video info ->\n", files);

    const image = await this.uploadService.uploadImage(files, jwtPayload);
    const urls = image.map((idx) => idx.url);

    res.cookie("inquiryImageUrl", urls, CookieOption);

    return {
      statusCode: 201,
      message: "문의 사진을 업로드 하였습니다.",
      result: image,
    };
  }

  @UseGuards(IsLoginGuard)
  @UseInterceptors(FilesInterceptor("video", 3, MulterConfig.upload("video")))
  @Post("/video/inquiry")
  async uploadVideoForInquiry(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ) {
    console.log("logging video info ->\n", files);

    const image = await this.uploadService.uploadVideo(files, jwtPayload);
    const urls = image.map((idx) => idx.url);

    res.cookie("InquiryVideoUrl", urls, CookieOption);

    return {
      statusCode: 201,
      message: "문의 동영상을 업로드 하였습니다.",
      result: image,
    };
  }

  @UseGuards(IsLoginGuard)
  @Delete("/image/product/cancel")
  async cancelImageUploadForProduct(
    @Cookies("productImageUrl") url: string,
    @Res() res: Response,
  ) {
    await this.uploadService.deleteUploadFile(url);

    res.clearCookie("productImageUrl");

    return {
      statusCode: 200,
      message: "상품 이미지 업로드를 취소하였습니다.",
    };
  }

  @UseGuards(IsLoginGuard)
  @Delete("/image/review/cancel")
  async cancelImageUploadForReview(
    @Cookies("reviewImageUrl") url: string,
    @Res() res: Response,
  ) {
    await this.uploadService.deleteUploadFile(url);

    res.clearCookie("reviewImageUrl");

    return {
      statusCode: 200,
      message: "리뷰 이미지 업로드를 취소하였습니다.",
    };
  }

  @UseGuards(IsLoginGuard)
  @Delete("/video/review/cancel")
  async cancelVideoUploadForReview(
    @Cookies("reviewVideoUrl") url: string,
    @Res() res: Response,
  ) {
    await this.uploadService.deleteUploadFile(url);

    res.clearCookie("reviewVideoUrl");

    return {
      statusCode: 200,
      message: "리뷰 동영상 업로드를 취소하였습니다.",
    };
  }

  @UseGuards(IsLoginGuard)
  @Delete("/image/inquiry/cancel")
  async cancelImageUploadForInquiry(
    @Cookies("inquiryImageUrl") url: string,
    @Res() res: Response,
  ) {
    await this.uploadService.deleteUploadFile(url);

    res.clearCookie("inquiryImageUrl");

    return {
      statusCode: 200,
      message: "문의 이미지 업로드를 취소하였습니다.",
    };
  }

  @UseGuards(IsLoginGuard)
  @Delete("/video/inquiry/cancel")
  async cancelVideoUploadForInquiry(
    @Cookies("inquiryVideoUrl") url: string,
    @Res() res: Response,
  ) {
    await this.uploadService.deleteUploadFile(url);

    res.clearCookie("inquiryVideoUrl");

    return {
      statusCode: 200,
      message: "문의 동영상 업로드를 취소하였습니다.",
    };
  }
}
