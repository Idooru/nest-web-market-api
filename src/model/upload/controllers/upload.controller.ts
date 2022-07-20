import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Delete,
} from "@nestjs/common";
import { JsonClearCookieInterface } from "./../../../common/interfaces/json.clear.cookie.interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json.clear.cookie.interceptor";
import { UploadService } from "../providers/upload.service";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { MulterConfig } from "src/common/config/multer.config";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { GetJWT } from "src/common/decorators/get.jwt.decorator";
import { JwtPayload } from "src/common/interfaces/jwt.payload.interface";
import { JsonSendCookieInterface } from "../../../common/interfaces/json.send.cookie.interface";
import { IsAdminGuard } from "../../../common/guards/is-admin.guard";
import { Cookies } from "src/common/decorators/cookies.decorator";
import { JsonSendCookieInterceptor } from "src/common/interceptors/json.send.cookie.interceptor";
import { MediaUrlCookie } from "src/common/interfaces/media.url.cookie.interface";

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {
    MulterConfig.createFolder("video", "image");
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseGuards(IsAdminGuard)
  @UseGuards(IsLoginGuard)
  @UseInterceptors(FileInterceptor("image", MulterConfig.upload("image")))
  @Post("/image/product")
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonSendCookieInterface<MediaUrlCookie>> {
    console.log("logging image info ->\n", file);

    this.uploadService.checkExtensionTypeForProductImage(file);

    const image = await this.uploadService.uploadProductImage(file, jwtPayload);

    return {
      statusCode: 201,
      message: "상품 사진을 업로드 하였습니다.",
      cookieKey: "Product_Image_Url_COOKIE",
      cookieValue: { name: image.name, url: image.url },
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(FilesInterceptor("image", 3, MulterConfig.upload("image")))
  @UseGuards(IsLoginGuard)
  @Post("/image/review")
  async uploadReviewImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonSendCookieInterface<string[][]>> {
    console.log("logging video info ->\n", files);

    this.uploadService.checkExtensionTypeForImages(files);

    const image = await this.uploadService.uploadReviewImage(files, jwtPayload);

    const reviewImages = image.map((idx) => [idx.name, idx.url]);

    return {
      statusCode: 201,
      message: "리뷰 사진을 업로드 하였습니다.",
      cookieKey: "Review_Image_Url_COOKIES",
      cookieValue: reviewImages,
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(FilesInterceptor("video", 3, MulterConfig.upload("video")))
  @UseGuards(IsLoginGuard)
  @Post("/video/review")
  async uploadReviewVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonSendCookieInterface<string[][]>> {
    console.log("logging video info ->\n", files);

    this.uploadService.checkExtensionTypeForVideos(files);

    const video = await this.uploadService.uploadReviewVideo(files, jwtPayload);
    const reviewVideos = video.map((idx) => [idx.name, idx.url]);

    return {
      statusCode: 201,
      message: "리뷰 동영상을 업로드 하였습니다.",
      cookieKey: "Review_Video_Url_COOKIES",
      cookieValue: reviewVideos,
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(FilesInterceptor("image", 3, MulterConfig.upload("image")))
  @UseGuards(IsLoginGuard)
  @Post("/image/inquiry")
  async uploadInquiryImage(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonSendCookieInterface<string[][]>> {
    console.log("logging video info ->\n", files);

    this.uploadService.checkExtensionTypeForImages(files);

    const image = await this.uploadService.uploadInquiryImage(
      files,
      jwtPayload,
    );
    const inquiryImages = image.map((idx) => [idx.name, idx.url]);

    return {
      statusCode: 201,
      message: "문의 사진을 업로드 하였습니다.",
      cookieKey: "Inquiry_Image_Url_COOKIES",
      cookieValue: inquiryImages,
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseInterceptors(FilesInterceptor("video", 3, MulterConfig.upload("video")))
  @UseGuards(IsLoginGuard)
  @Post("/video/inquiry")
  async uploadInquiryVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonSendCookieInterface<string[][]>> {
    console.log("logging video info ->\n", files);

    this.uploadService.checkExtensionTypeForVideos(files);

    const video = await this.uploadService.uploadInquiryVideo(
      files,
      jwtPayload,
    );
    const InquiryVideos = video.map((idx) => [idx.name, idx.url]);

    return {
      statusCode: 201,
      message: "문의 동영상을 업로드 하였습니다.",
      cookieKey: "Inquiry_Video_Url_COOKIES",
      cookieValue: InquiryVideos,
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/image/product/cancel")
  async cancelImageUploadForProduct(
    @Cookies("Product_Image_Url_COOKIE")
    productImgCookie: MediaUrlCookie,
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteProductImage(productImgCookie);

    return {
      statusCode: 200,
      message: "상품 사진 업로드를 취소하였습니다.",
      cookieKey: "Product_Image_Url_COOKIE",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/image/review/cancel")
  async cancelImageUploadForReview(
    @Cookies("Review_Image_Url_COOKIES") reviewImgCookie: MediaUrlCookie[],
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteReviewImages(reviewImgCookie);

    return {
      statusCode: 200,
      message: "리뷰 사진 업로드를 취소하였습니다.",
      cookieKey: "Review_Image_Url_COOKIES",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/video/review/cancel")
  async cancelVideoUploadForReview(
    @Cookies("Review_Video_Url_COOKIES") reviewVdoCookie: MediaUrlCookie[],
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteReviewVideos(reviewVdoCookie);

    return {
      statusCode: 200,
      message: "리뷰 동영상 업로드를 취소하였습니다.",
      cookieKey: "Review_Video_Url_COOKIES",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/image/inquiry/cancel")
  async cancelImageUploadForInquiry(
    @Cookies("Inquiry_Image_Url_COOKIES") inquiryImgCookie: MediaUrlCookie[],
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteInquiryImages(inquiryImgCookie);

    return {
      statusCode: 200,
      message: "문의 사진 업로드를 취소하였습니다.",
      cookieKey: "Inquiry_Image_Url_COOKIES",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/video/inquiry/cancel")
  async cancelVideoUploadForInquiry(
    @Cookies("Inquiry_Video_Url_COOKIES") InquiryVdoCookie: MediaUrlCookie[],
  ): Promise<JsonClearCookieInterface> {
    await this.uploadService.deleteInquiryVideos(InquiryVdoCookie);

    return {
      statusCode: 200,
      message: "문의 동영상 업로드를 취소하였습니다.",
      cookieKey: "Inquiry_Video_Url_COOKIES",
    };
  }
}
