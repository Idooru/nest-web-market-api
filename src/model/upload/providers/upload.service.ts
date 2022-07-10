import { ImagesEntity, VideosEntity } from "./../entities/upload.entity";
import { ConfigService } from "@nestjs/config";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "../../user/providers/user.repository";
import { UploadRepository } from "../providers/upload.repository";
import { MediaReturnDto } from "../dto/media-return.dto";
import { JwtPayload } from "../../../common/interfaces/jwt.payload.interface";

import * as fs from "fs";
import * as path from "path";

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

  deleteProductImageOnServerDisk(url: string) {
    const imageFileName = url.replace(
      `http://localhost:${new ConfigService().get("PORT")}/media/`,
      "",
    );
    const deletePath = path.join(
      __dirname,
      `../../../../uploads/image/${imageFileName}`,
    );

    fs.rmSync(deletePath);
  }

  deleteImageFilesOnServerDisk() {}

  deleteVideoFilesOnServerDisk() {}

  async uploadImageForProduct(
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

    return await this.uploadRepository.uploadImageForProduct({
      media: image,
      uploader: user,
    });
  }

  async copyImageFromImagePreparation(
    creater: string,
  ): Promise<MediaReturnDto> {
    const user = await this.userRepository.findUserWithNickName(creater);

    // 상품 준비 이미지를 가져온다.
    const imagePreparation = await this.uploadRepository.findImagePreparation();
    const parseUrl = imagePreparation.url.replace(
      `http://localhost:${this.configService.get("PORT")}/media/`,
      "",
    );
    const src = path.join(__dirname, `../../../../uploads/image/${parseUrl}`);
    const dest = path.join(
      __dirname,
      `../../../../uploads/image/imagepreparation-${Date.now()}.jpg`,
    );

    try {
      fs.copyFileSync(src, dest);
    } catch (err) {
      await this.uploadRepository.deleteUploadImageWithId(imagePreparation.id);

      const errMsg = `서버 디스크에서 ${src.replace(
        "/root/Coding/nodejs/nest_project/nestWebMarket_API/uploads/image/",
        "",
      )}를 찾을 수 없습니다. 이미지 준비 이미지를 다시 업로드 하세요.`;
      throw new NotFoundException(errMsg);
    }

    const image = dest.replace(
      "/root/Coding/nodejs/nest_project/nestWebMarket_API/uploads/image/",
      "",
    );

    return await this.uploadRepository.uploadImageForProduct({
      media: image,
      uploader: user,
    });
  }

  async uploadImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtPayload,
  ): Promise<MediaReturnDto[]> {
    const imageUrls = [];
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (!files) {
      throw new BadRequestException(
        "사진을 업로드 할 수 없습니다. 사진을 제시해주세요.",
      );
    } else if (files.length >= 2) {
      for (const index of files) {
        const image = index.filename;

        imageUrls.push(
          await this.uploadRepository.uploadImageForReview({
            media: image,
            uploader: user,
          }),
        );
      }
    } else {
      const image = files[0].filename;
      imageUrls.push(
        await this.uploadRepository.uploadImageForReview({
          media: image,
          uploader: user,
        }),
      );
    }

    return imageUrls;
  }

  async uploadVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtPayload,
  ): Promise<MediaReturnDto[]> {
    const videoUrls = [];
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (!files) {
      throw new BadRequestException(
        "동영상을 업로드 할 수 없습니다. 동영상을 제시해주세요.",
      );
    } else if (files.length >= 2) {
      for (const index of files) {
        const video = index.filename;
        videoUrls.push(
          await this.uploadRepository.uploadVideoForInquiry({
            media: video,
            uploader: user,
          }),
        );
      }
    } else {
      const video = files[0].filename;
      videoUrls.push(
        await this.uploadRepository.uploadVideoForInquiry({
          media: video,
          uploader: user,
        }),
      );
    }

    return videoUrls;
  }

  async deleteUploadProductImage(url: string): Promise<void> {
    const image = await this.uploadRepository.findImageWithUrl(url);

    await this.uploadRepository.deleteUploadImageWithId(image.id);
    this.deleteProductImageOnServerDisk(image.url);
  }

  async deleteUploadImages(urls: string[]): Promise<void> {
    let image: ImagesEntity;

    if (urls.length >= 2) {
      urls.forEach(async (idx) => {
        image = await this.uploadRepository.findImageWithUrl(idx);
        await this.uploadRepository.deleteUploadImageWithId(image.id);
        this.deleteImageFilesOnServerDisk();
      });
      return;
    }
    image = await this.uploadRepository.findImageWithUrl(urls[0]);

    await this.uploadRepository.deleteUploadImageWithId(image.id);
    this.deleteImageFilesOnServerDisk();
  }

  async deleteUploadVideos(urls: string[]): Promise<void> {
    let video: VideosEntity;

    if (urls.length >= 2) {
      urls.forEach(async (idx) => {
        video = await this.uploadRepository.findVideoWithUrl(idx);
        await this.uploadRepository.deleteUploadVideoWithId(video.id);
        this.deleteVideoFilesOnServerDisk();
      });
      return;
    }
    video = await this.uploadRepository.findVideoWithUrl(urls[0]);

    await this.uploadRepository.deleteUploadVideoWithId(video.id);
    this.deleteVideoFilesOnServerDisk();
  }
}
