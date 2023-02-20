import { BadRequestException, Injectable } from "@nestjs/common";
import { UploadGeneralRepository } from "../repositories/upload-general.repository";
import { MediaReturnDto } from "../dto/media-return.dto";
import { JwtAccessTokenPayload } from "../../auth/jwt/jwt-access-token-payload.interface";
import { MediaUrlCookieValue } from "../media.url.cookies.interface";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadGeneralService {
  constructor(
    private readonly uploadGeneralRepository: UploadGeneralRepository,
    private readonly userRepository: UserGeneralRepository,
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

    return await this.uploadGeneralRepository.uploadProductImage({
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
          await this.uploadGeneralRepository.uploadReviewImage({
            media: image,
            uploader: user,
          }),
        );
      }
    } else {
      const image = files[0].filename;
      imageUrls.push(
        await this.uploadGeneralRepository.uploadReviewImage({
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
          await this.uploadGeneralRepository.uploadReviewVideo({
            media: video,
            uploader: user,
          }),
        );
      }
    } else {
      const video = files[0].filename;
      videoUrls.push(
        await this.uploadGeneralRepository.uploadReviewVideo({
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
          await this.uploadGeneralRepository.uploadInquiryImage({
            media: image,
            uploader: user,
          }),
        );
      }
    } else {
      const image = files[0].filename;
      imageUrls.push(
        await this.uploadGeneralRepository.uploadInquiryImage({
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
          await this.uploadGeneralRepository.uploadInquiryVideo({
            media: video,
            uploader: user,
          }),
        );
      }
    } else {
      const video = files[0].filename;
      videoUrls.push(
        await this.uploadGeneralRepository.uploadInquiryVideo({
          media: video,
          uploader: user,
        }),
      );
    }

    return videoUrls;
  }

  async deleteProductImage(imageCookie: MediaUrlCookieValue): Promise<void> {
    const image = await this.uploadGeneralRepository.findProductImageWithUrl(
      imageCookie.url,
    );

    await this.uploadGeneralRepository.deleteProductImageWithId(image.id);
    this.deleteMediaFilesOnServerDisk(imageCookie.name, "image/product");
  }

  async deleteReviewImages(imageCookies: MediaUrlCookieValue[]): Promise<void> {
    if (imageCookies.length >= 2) {
      for (const cookie of imageCookies) {
        const image = await this.uploadGeneralRepository.findReviewImageWithUrl(
          cookie.url,
        );
        await this.uploadGeneralRepository.deleteReviewImageWithId(image.id);
        this.deleteMediaFilesOnServerDisk(cookie.name, "image/review");
      }
    } else {
      const image = await this.uploadGeneralRepository.findReviewImageWithUrl(
        imageCookies[0].url,
      );

      await this.uploadGeneralRepository.deleteReviewImageWithId(image.id);
      this.deleteMediaFilesOnServerDisk(imageCookies[0].name, "image/review");
    }
  }

  async deleteReviewVideos(videoCookies: MediaUrlCookieValue[]): Promise<void> {
    if (videoCookies.length >= 2) {
      for (const cookie of videoCookies) {
        const video = await this.uploadGeneralRepository.findReviewVideoWithUrl(
          cookie.url,
        );
        await this.uploadGeneralRepository.deleteReviewVideoWithId(video.id);
        this.deleteMediaFilesOnServerDisk(cookie.name, "video/review");
      }
    } else {
      const video = await this.uploadGeneralRepository.findReviewVideoWithUrl(
        videoCookies[0].url,
      );

      await this.uploadGeneralRepository.deleteReviewVideoWithId(video.id);
      this.deleteMediaFilesOnServerDisk(videoCookies[0].name, "video/review");
    }
  }

  async deleteInquiryImages(
    imageCookies: MediaUrlCookieValue[],
  ): Promise<void> {
    if (imageCookies.length >= 2) {
      for (const cookie of imageCookies) {
        const image =
          await this.uploadGeneralRepository.findInquiryImageWithUrl(
            cookie.url,
          );
        await this.uploadGeneralRepository.deleteInquiryImageWithId(image.id);
        this.deleteMediaFilesOnServerDisk(cookie.name, "image/inquiry");
      }
    } else {
      const image = await this.uploadGeneralRepository.findInquiryImageWithUrl(
        imageCookies[0].url,
      );

      await this.uploadGeneralRepository.deleteInquiryImageWithId(image.id);
      this.deleteMediaFilesOnServerDisk(imageCookies[0].name, "image/inquiry");
    }
  }

  async deleteInquiryVideos(
    videoCookies: MediaUrlCookieValue[],
  ): Promise<void> {
    if (videoCookies.length >= 2) {
      for (const cookie of videoCookies) {
        const video =
          await this.uploadGeneralRepository.findInquiryVideoWithUrl(
            cookie.url,
          );
        await this.uploadGeneralRepository.deleteInquiryVideoWithId(video.id);
        this.deleteMediaFilesOnServerDisk(cookie.name, "video/inquiry");
      }
    } else {
      const video = await this.uploadGeneralRepository.findInquiryVideoWithUrl(
        videoCookies[0].url,
      );

      await this.uploadGeneralRepository.deleteInquiryVideoWithId(video.id);
      this.deleteMediaFilesOnServerDisk(videoCookies[0].name, "video/inquiry");
    }
  }
}
