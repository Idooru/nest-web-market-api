import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "../../user/providers/user.repository";
import { UploadRepository } from "../providers/upload.repository";
import { MediaReturnDto } from "../dto/media-return.dto";
import { JwtAccessTokenPayload } from "../../auth/jwt/jwt-access-token-payload.interface";
import { MediaUrlCookieValue } from "../media.url.cookies.interface";

import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  isExistMediaFile(mediaType: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        `${mediaType}을(를) 업로드 할 수 없습니다. 파일을 제시해주세요.`,
      );
    }
  }

  isExistMediaFiles(mediaType: string, files: Express.Multer.File[]) {
    if (!files) {
      throw new BadRequestException(
        `${mediaType}을(를) 업로드 할 수 없습니다. 파일을 제시해주세요.`,
      );
    }
  }

  deleteMediaFilesOnServerDisk(imageName: string, mediaPath: string) {
    fs.rmSync(
      path.join(__dirname, `../../../../uploads/${mediaPath}/${imageName}`),
    );
  }

  async uploadProductImage(
    file: Express.Multer.File,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<MediaReturnDto> {
    const user = await this.userRepository.findUserWithId(jwtPayload.userId);
    const image = file.filename;

    return await this.uploadRepository.uploadProductImage({
      media: image,
      uploader: user,
    });
  }

  async uploadReviewImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<MediaReturnDto[]> {
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);
    const imageUrls = [];

    if (files.length >= 2) {
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
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<MediaReturnDto[]> {
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);
    const videoUrls = [];

    if (files.length >= 2) {
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
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<MediaReturnDto[]> {
    const imageUrls = [];
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (files.length >= 2) {
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
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<MediaReturnDto[]> {
    const videoUrls = [];
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (files.length >= 2) {
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

  async deleteProductImage(imageCookie: MediaUrlCookieValue): Promise<void> {
    const image = await this.uploadRepository.findProductImageWithUrl(
      imageCookie.url,
    );

    await this.uploadRepository.deleteProductImageWithId(image.id);
    this.deleteMediaFilesOnServerDisk(imageCookie.name, "image/product");
  }

  async deleteReviewImages(imageCookies: MediaUrlCookieValue[]): Promise<void> {
    if (imageCookies.length >= 2) {
      for (const cookie of imageCookies) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          cookie.url,
        );
        await this.uploadRepository.deleteReviewImageWithId(image.id);
        this.deleteMediaFilesOnServerDisk(cookie.name, "image/review");
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        imageCookies[0].url,
      );

      await this.uploadRepository.deleteReviewImageWithId(image.id);
      this.deleteMediaFilesOnServerDisk(imageCookies[0].name, "image/review");
    }
  }

  async deleteReviewVideos(videoCookies: MediaUrlCookieValue[]): Promise<void> {
    if (videoCookies.length >= 2) {
      for (const cookie of videoCookies) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          cookie.url,
        );
        await this.uploadRepository.deleteReviewVideoWithId(video.id);
        this.deleteMediaFilesOnServerDisk(cookie.name, "video/review");
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        videoCookies[0].url,
      );

      await this.uploadRepository.deleteReviewVideoWithId(video.id);
      this.deleteMediaFilesOnServerDisk(videoCookies[0].name, "video/review");
    }
  }

  async deleteInquiryImages(
    imageCookies: MediaUrlCookieValue[],
  ): Promise<void> {
    if (imageCookies.length >= 2) {
      for (const cookie of imageCookies) {
        const image = await this.uploadRepository.findInquiryImageWithUrl(
          cookie.url,
        );
        await this.uploadRepository.deleteInquiryImageWithId(image.id);
        this.deleteMediaFilesOnServerDisk(cookie.name, "image/inquiry");
      }
    } else {
      const image = await this.uploadRepository.findInquiryImageWithUrl(
        imageCookies[0].url,
      );

      await this.uploadRepository.deleteInquiryImageWithId(image.id);
      this.deleteMediaFilesOnServerDisk(imageCookies[0].name, "image/inquiry");
    }
  }

  async deleteInquiryVideos(
    videoCookies: MediaUrlCookieValue[],
  ): Promise<void> {
    if (videoCookies.length >= 2) {
      for (const cookie of videoCookies) {
        const video = await this.uploadRepository.findInquiryVideoWithUrl(
          cookie.url,
        );
        await this.uploadRepository.deleteInquiryVideoWithId(video.id);
        this.deleteMediaFilesOnServerDisk(cookie.name, "video/inquiry");
      }
    } else {
      const video = await this.uploadRepository.findInquiryVideoWithUrl(
        videoCookies[0].url,
      );

      await this.uploadRepository.deleteInquiryVideoWithId(video.id);
      this.deleteMediaFilesOnServerDisk(videoCookies[0].name, "video/inquiry");
    }
  }
}
