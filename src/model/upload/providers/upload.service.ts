import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserRepository } from "../../user/providers/user.repository";
import { UploadRepository } from "../providers/upload.repository";
import { MediaReturnDto } from "../dto/media-return.dto";
import { JwtPayload } from "../../auth/jwt/jwt.payload.interface";
import { MediaUrlCookie } from "src/model/upload/media.url.cookie.interface";

import * as fs from "fs";
import * as path from "path";
import { ReviewImageEntity } from "../entities/review.image.entity";
import { ReviewVideoEntity } from "../entities/review.video.entity";
import { InquiryImageEntity } from "../../inquiry/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "../../inquiry/entities/inquiry.video.entity";

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  checkExtensionTypeForProductImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        "상품 사진을 업로드 할 수 없습니다. 상품 사진을 제시해 주세요.",
      );
    }

    if (!file.mimetype.includes("image")) {
      throw new BadRequestException(
        "해당 파일의 확장자는 이미지 파일의 확장자가 아닙니다.",
      );
    }
  }

  checkExtensionTypeForImages(files: Array<Express.Multer.File>) {
    if (!files.length) {
      throw new BadRequestException(
        "사진을 업로드 할 수 없습니다. 사진을 제시해 주세요.",
      );
    } else if (files.length >= 2) {
      files.forEach((idx) => {
        if (!idx.mimetype.includes("image")) {
          throw new BadRequestException(
            "해당 파일의 확장자는 이미지 파일의 확장자가 아닙니다.",
          );
        }
      });
    } else {
      if (!files[0].mimetype.includes("image")) {
        throw new BadRequestException(
          "해당 파일의 확장자는 이미지 파일의 확장자가 아닙니다.",
        );
      }
    }
  }

  checkExtensionTypeForVideos(files: Array<Express.Multer.File>) {
    if (!files.length) {
      throw new BadRequestException(
        "동영상을 업로드 할 수 없습니다. 동영상을 제시해 주세요.",
      );
    } else if (files.length >= 2) {
      files.forEach((idx) => {
        if (!idx.mimetype.includes("video")) {
          throw new BadRequestException(
            "해당 파일의 확장자는 동영상 파일의 확장자가 아닙니다.",
          );
        }
      });
    } else {
      if (!files[0].mimetype.includes("video")) {
        throw new BadRequestException(
          "해당 파일의 확장자는 동영상 파일의 확장자가 아닙니다.",
        );
      }
    }
  }

  deleteProductImageOnServerDisk(imageName: string) {
    const imageFileName = imageName.replace(
      `http://${this.configService.get(
        "APPLICATION_HOST",
      )}:${this.configService.get("APPLICATION_PORT")}/media/`,
      "",
    );

    const deletePath = path.join(
      __dirname,
      `../../../../uploads/image/${imageFileName}`,
    );

    fs.rmSync(deletePath);
  }

  deleteImageFilesOnServerDisk(imageName: string) {
    const deletePath = path.join(
      __dirname,
      `../../../../uploads/image/${imageName}`,
    );

    fs.rmSync(deletePath);
  }

  deleteVideoFilesOnServerDisk(videoName: string) {
    const deletePath = path.join(
      __dirname,
      `../../../../uploads/video/${videoName}`,
    );

    fs.rmSync(deletePath);
  }

  async uploadProductImage(
    file: Express.Multer.File,
    jwtPayload: JwtPayload,
  ): Promise<MediaReturnDto> {
    if (!file) {
      throw new BadRequestException(
        "사진을 업로드 할 수 없습니다. 사진을 제시해 주세요.",
      );
    }

    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    const image = file.filename;

    return await this.uploadRepository.uploadProductImage({
      media: image,
      uploader: user,
    });
  }

  async uploadReviewImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtPayload,
  ): Promise<MediaReturnDto[]> {
    const imageUrls = [];
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (!files) {
      throw new BadRequestException(
        "리뷰 사진을 업로드 할 수 없습니다. 리뷰 사진을 제시해주세요.",
      );
    } else if (files.length >= 2) {
      for (const index of files) {
        const image = index.filename;
        imageUrls.push(
          await this.uploadRepository.uploadReviewImage({
            media: image,
            uploader: user,
          }),
        );
      }
    } else {
      const image = files[0].filename;
      imageUrls.push(
        await this.uploadRepository.uploadReviewImage({
          media: image,
          uploader: user,
        }),
      );
    }

    return imageUrls;
  }

  async uploadReviewVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtPayload,
  ): Promise<MediaReturnDto[]> {
    const videoUrls = [];
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (!files) {
      throw new BadRequestException(
        "리뷰 동영상을 업로드 할 수 없습니다. 리뷰 동영상을 제시해주세요.",
      );
    } else if (files.length >= 2) {
      for (const index of files) {
        const video = index.filename;
        videoUrls.push(
          await this.uploadRepository.uploadReviewVideo({
            media: video,
            uploader: user,
          }),
        );
      }
    } else {
      const video = files[0].filename;
      videoUrls.push(
        await this.uploadRepository.uploadReviewVideo({
          media: video,
          uploader: user,
        }),
      );
    }

    return videoUrls;
  }

  async uploadInquiryImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtPayload,
  ): Promise<MediaReturnDto[]> {
    const imageUrls = [];
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (!files) {
      throw new BadRequestException(
        "문의 사진을 업로드 할 수 없습니다. 문의 사진을 제시해주세요.",
      );
    } else if (files.length >= 2) {
      for (const index of files) {
        const image = index.filename;
        imageUrls.push(
          await this.uploadRepository.uploadInquiryImage({
            media: image,
            uploader: user,
          }),
        );
      }
    } else {
      const image = files[0].filename;
      imageUrls.push(
        await this.uploadRepository.uploadInquiryImage({
          media: image,
          uploader: user,
        }),
      );
    }

    return imageUrls;
  }

  async uploadInquiryVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtPayload,
  ): Promise<MediaReturnDto[]> {
    const videoUrls = [];
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (!files) {
      throw new BadRequestException(
        "문의 동영상을 업로드 할 수 없습니다. 문의 동영상을 제시해주세요.",
      );
    } else if (files.length >= 2) {
      for (const index of files) {
        const video = index.filename;
        videoUrls.push(
          await this.uploadRepository.uploadInquiryVideo({
            media: video,
            uploader: user,
          }),
        );
      }
    } else {
      const video = files[0].filename;
      videoUrls.push(
        await this.uploadRepository.uploadInquiryVideo({
          media: video,
          uploader: user,
        }),
      );
    }

    return videoUrls;
  }

  async deleteProductImage(productImgCookie: MediaUrlCookie): Promise<void> {
    const image = await this.uploadRepository.findProductImageWithUrl(
      productImgCookie.url,
    );

    await this.uploadRepository.deleteProductImageWithId(image.id);
    this.deleteProductImageOnServerDisk(productImgCookie.name);
  }

  async deleteReviewImages(imageCookies: MediaUrlCookie[]): Promise<void> {
    let image: ReviewImageEntity;

    if (imageCookies.length >= 2) {
      for (const idx of imageCookies) {
        image = await this.uploadRepository.findReviewImageWithUrl(idx[1]);
        await this.uploadRepository.deleteReviewImageWithId(image.id);
        this.deleteImageFilesOnServerDisk(idx[0]);
      }
      return;
    }

    image = await this.uploadRepository.findReviewImageWithUrl(
      imageCookies[0].url,
    );

    await this.uploadRepository.deleteReviewImageWithId(image.id);
    this.deleteImageFilesOnServerDisk(imageCookies[0].name);
  }

  async deleteReviewVideos(videoCookies: MediaUrlCookie[]): Promise<void> {
    let video: ReviewVideoEntity;

    if (videoCookies.length >= 2) {
      for (const idx of videoCookies) {
        video = await this.uploadRepository.findReviewVideoWithUrl(idx[1]);
        await this.uploadRepository.deleteReviewVideoWithId(video.id);
        this.deleteVideoFilesOnServerDisk(idx[0]);
      }
      return;
    }

    video = await this.uploadRepository.findReviewVideoWithUrl(
      videoCookies[0].url,
    );

    await this.uploadRepository.deleteReviewVideoWithId(video.id);
    this.deleteVideoFilesOnServerDisk(videoCookies[0].name);
  }

  async deleteInquiryImages(imageCookies: MediaUrlCookie[]): Promise<void> {
    let image: InquiryImageEntity;

    if (imageCookies.length >= 2) {
      for (const idx of imageCookies) {
        image = await this.uploadRepository.findInquiryImageWithUrl(idx[1]);
        await this.uploadRepository.deleteInquiryImageWithId(image.id);
        this.deleteImageFilesOnServerDisk(idx[0]);
      }
      return;
    }

    image = await this.uploadRepository.findInquiryImageWithUrl(
      imageCookies[0].url,
    );

    await this.uploadRepository.deleteInquiryImageWithId(image.id);
    this.deleteImageFilesOnServerDisk(imageCookies[0].name);
  }

  async deleteInquiryVideos(videoCookies: MediaUrlCookie[]): Promise<void> {
    let video: InquiryVideoEntity;

    if (videoCookies.length >= 2) {
      for (const idx of videoCookies) {
        video = await this.uploadRepository.findInquiryVideoWithUrl(idx[1]);
        await this.uploadRepository.deleteInquiryVideoWithId(video.id);
        this.deleteVideoFilesOnServerDisk(idx[0]);
      }
      return;
    }

    video = await this.uploadRepository.findInquiryVideoWithUrl(
      videoCookies[0].url,
    );

    await this.uploadRepository.deleteInquiryVideoWithId(video.id);
    this.deleteVideoFilesOnServerDisk(videoCookies[0].name);
  }
}
