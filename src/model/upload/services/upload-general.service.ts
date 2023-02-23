import { BadRequestException, Injectable } from "@nestjs/common";
import { UploadGeneralRepository } from "../repositories/upload-general.repository";
import { JwtAccessTokenPayload } from "../../auth/jwt/jwt-access-token-payload.interface";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { ConfigService } from "@nestjs/config";
import { ReceiveMediaDto } from "../dto/receive-media.dto";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadGeneralService {
  constructor(
    private readonly uploadGeneralRepository: UploadGeneralRepository,
    private readonly userRepository: UserGeneralRepository,
    private readonly configService: ConfigService,
  ) {}

  isExistMediaFile(
    mediaType: string,
    file: Express.Multer.File | Express.Multer.File[],
  ) {
    if (!file) {
      throw new BadRequestException(
        `${mediaType}을(를) 업로드 할 수 없습니다. 파일을 제시해주세요.`,
      );
    }
  }

  setUrl(mediaFileName: string): string {
    return `http://${this.configService.get(
      "APPLICATION_HOST",
    )}:${this.configService.get(
      "APPLICATION_PORT",
    )}/media/${mediaFileName}`.toLowerCase();
  }

  deleteMediaFilesOnServerDisk(imageName: string, mediaPath: string) {
    fs.rmSync(
      path.join(__dirname, `../../../../uploads/${mediaPath}/${imageName}`),
    );
  }

  async uploadProductImage(
    file: Express.Multer.File,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const user = await this.userRepository.findUserWithId(jwtPayload.userId);
    const url = this.setUrl(file.filename);

    await this.uploadGeneralRepository.uploadProductImage({
      url,
      uploader: user,
    });
  }

  async uploadReviewImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (files.length >= 2) {
      for (const file of files) {
        const url = this.setUrl(file.filename);
        await this.uploadGeneralRepository.uploadReviewImage({
          url,
          uploader: user,
        });
      }
    } else {
      const url = this.setUrl(files[0].fieldname);
      await this.uploadGeneralRepository.uploadReviewImage({
        url,
        uploader: user,
      });
    }
  }

  async uploadReviewVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (files.length >= 2) {
      for (const file of files) {
        const url = this.setUrl(file.filename);
        await this.uploadGeneralRepository.uploadReviewVideo({
          url,
          uploader: user,
        });
      }
    } else {
      const url = this.setUrl(files[0].filename);
      await this.uploadGeneralRepository.uploadReviewVideo({
        url,
        uploader: user,
      });
    }
  }

  async uploadInquiryImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (files.length >= 2) {
      for (const file of files) {
        const url = this.setUrl(file.filename);
        await this.uploadGeneralRepository.uploadInquiryImage({
          url,
          uploader: user,
        });
      }
    } else {
      const url = this.setUrl(files[0].fieldname);
      await this.uploadGeneralRepository.uploadInquiryImage({
        url,
        uploader: user,
      });
    }
  }

  async uploadInquiryVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const uploader = jwtPayload.nickname;
    const user = await this.userRepository.findUserWithNickName(uploader);

    if (files.length >= 2) {
      for (const file of files) {
        const url = this.setUrl(file.filename);
        await this.uploadGeneralRepository.uploadInquiryVideo({
          url,
          uploader: user,
        });
      }
    } else {
      const url = this.setUrl(files[0].fieldname);
      await this.uploadGeneralRepository.uploadInquiryVideo({
        url,
        uploader: user,
      });
    }
  }

  async deleteProductImage(imageCookie: ReceiveMediaDto): Promise<void> {
    const image = await this.uploadGeneralRepository.findProductImageWithUrl(
      imageCookie.url,
    );

    await this.uploadGeneralRepository.deleteProductImageWithId(image.id);
    this.deleteMediaFilesOnServerDisk(imageCookie.fileName, "image/product");
  }

  async deleteReviewImages(imageCookies: ReceiveMediaDto[]): Promise<void> {
    if (imageCookies.length >= 2) {
      for (const cookie of imageCookies) {
        const image = await this.uploadGeneralRepository.findReviewImageWithUrl(
          cookie.url,
        );
        await this.uploadGeneralRepository.deleteReviewImageWithId(image.id);
        this.deleteMediaFilesOnServerDisk(cookie.fileName, "image/review");
      }
    } else {
      const image = await this.uploadGeneralRepository.findReviewImageWithUrl(
        imageCookies[0].url,
      );

      await this.uploadGeneralRepository.deleteReviewImageWithId(image.id);
      this.deleteMediaFilesOnServerDisk(
        imageCookies[0].fileName,
        "image/review",
      );
    }
  }

  async deleteReviewVideos(videoCookies: ReceiveMediaDto[]): Promise<void> {
    if (videoCookies.length >= 2) {
      for (const cookie of videoCookies) {
        const video = await this.uploadGeneralRepository.findReviewVideoWithUrl(
          cookie.url,
        );
        await this.uploadGeneralRepository.deleteReviewVideoWithId(video.id);
        this.deleteMediaFilesOnServerDisk(cookie.fileName, "video/review");
      }
    } else {
      const video = await this.uploadGeneralRepository.findReviewVideoWithUrl(
        videoCookies[0].url,
      );

      await this.uploadGeneralRepository.deleteReviewVideoWithId(video.id);
      this.deleteMediaFilesOnServerDisk(
        videoCookies[0].fileName,
        "video/review",
      );
    }
  }

  async deleteInquiryImages(imageCookies: ReceiveMediaDto[]): Promise<void> {
    if (imageCookies.length >= 2) {
      for (const cookie of imageCookies) {
        const image =
          await this.uploadGeneralRepository.findInquiryImageWithUrl(
            cookie.url,
          );
        await this.uploadGeneralRepository.deleteInquiryImageWithId(image.id);
        this.deleteMediaFilesOnServerDisk(cookie.fileName, "image/inquiry");
      }
    } else {
      const image = await this.uploadGeneralRepository.findInquiryImageWithUrl(
        imageCookies[0].url,
      );

      await this.uploadGeneralRepository.deleteInquiryImageWithId(image.id);
      this.deleteMediaFilesOnServerDisk(
        imageCookies[0].fileName,
        "image/inquiry",
      );
    }
  }

  async deleteInquiryVideos(videoCookies: ReceiveMediaDto[]): Promise<void> {
    if (videoCookies.length >= 2) {
      for (const cookie of videoCookies) {
        const video =
          await this.uploadGeneralRepository.findInquiryVideoWithUrl(
            cookie.url,
          );
        await this.uploadGeneralRepository.deleteInquiryVideoWithId(video.id);
        this.deleteMediaFilesOnServerDisk(cookie.fileName, "video/inquiry");
      }
    } else {
      const video = await this.uploadGeneralRepository.findInquiryVideoWithUrl(
        videoCookies[0].url,
      );

      await this.uploadGeneralRepository.deleteInquiryVideoWithId(video.id);
      this.deleteMediaFilesOnServerDisk(
        videoCookies[0].fileName,
        "video/inquiry",
      );
    }
  }
}
