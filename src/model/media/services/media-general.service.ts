import { Injectable } from "@nestjs/common";
import { JwtAccessTokenPayload } from "../../auth/jwt/jwt-access-token-payload.interface";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { ReceiveMediaDto } from "../dto/receive-media.dto";
import { ReturnMediaDto } from "../dto/return-media.dto";
import { MediaGeneralRepository } from "../repositories/media-general.repository";
import { MediaRedundantService } from "./media-redundant.service";

@Injectable()
export class MediaGeneralService {
  constructor(
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly userRepository: UserGeneralRepository,
    private readonly mediaRedundantService: MediaRedundantService,
  ) {}

  createMediaCookieValue(
    cookieKey: string,
    file: Express.Multer.File,
  ): ReturnMediaDto {
    return {
      whatCookie: cookieKey,
      url: this.mediaRedundantService.setUrl(file.filename),
      fileName: file.filename,
    };
  }

  createMediaCookieValues(
    cookieKey: string,
    files: Express.Multer.File[],
  ): ReturnMediaDto[] {
    return files.map((file) => ({
      whatCookie: cookieKey,
      url: this.mediaRedundantService.setUrl(file.filename),
      fileName: file.filename,
    }));
  }

  async uploadProductImage(
    file: Express.Multer.File,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const user = await this.userRepository.findAdminUserProfileInfoWithId(
      jwtPayload.userId,
    );
    const url = this.mediaRedundantService.setUrl(file.filename);

    await this.mediaGeneralRepository.uploadProductImage({
      url,
      uploader: user.Auth.email,
    });
  }

  async uploadReviewImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      for (const file of files) {
        const url = this.mediaRedundantService.setUrl(file.filename);
        await this.mediaGeneralRepository.uploadReviewImage({
          url,
          uploader: user.Auth.email,
        });
      }
    } else {
      const url = this.mediaRedundantService.setUrl(files[0].filename);
      await this.mediaGeneralRepository.uploadReviewImage({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadReviewVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      for (const file of files) {
        const url = this.mediaRedundantService.setUrl(file.filename);
        await this.mediaGeneralRepository.uploadReviewVideo({
          url,
          uploader: user.Auth.email,
        });
      }
    } else {
      const url = this.mediaRedundantService.setUrl(files[0].filename);
      await this.mediaGeneralRepository.uploadReviewVideo({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadInquiryImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      for (const file of files) {
        const url = this.mediaRedundantService.setUrl(file.filename);
        await this.mediaGeneralRepository.uploadInquiryImage({
          url,
          uploader: user.Auth.email,
        });
      }
    } else {
      const url = this.mediaRedundantService.setUrl(files[0].filename);
      await this.mediaGeneralRepository.uploadInquiryImage({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadInquiryVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      for (const file of files) {
        const url = this.mediaRedundantService.setUrl(file.filename);
        await this.mediaGeneralRepository.uploadInquiryVideo({
          url,
          uploader: user.Auth.email,
        });
      }
    } else {
      const url = this.mediaRedundantService.setUrl(files[0].filename);
      await this.mediaGeneralRepository.uploadInquiryVideo({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async deleteProductImage(imageCookie: ReceiveMediaDto): Promise<void> {
    const image = await this.mediaGeneralRepository.findProductImageWithUrl(
      imageCookie.url,
    );

    await this.mediaGeneralRepository.deleteProductImageWithId(image.id);
    this.mediaRedundantService.deleteMediaFilesOnServerDisk(
      imageCookie.fileName,
      "image/product",
    );
  }

  async deleteReviewImages(imageCookies: ReceiveMediaDto[]): Promise<void> {
    if (imageCookies.length >= 2) {
      for (const cookie of imageCookies) {
        const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteReviewImageWithId(image.id);
        this.mediaRedundantService.deleteMediaFilesOnServerDisk(
          cookie.fileName,
          "image/review",
        );
      }
    } else {
      const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
        imageCookies[0].url,
      );

      await this.mediaGeneralRepository.deleteReviewImageWithId(image.id);
      this.mediaRedundantService.deleteMediaFilesOnServerDisk(
        imageCookies[0].fileName,
        "image/review",
      );
    }
  }

  async deleteReviewVideos(videoCookies: ReceiveMediaDto[]): Promise<void> {
    if (videoCookies.length >= 2) {
      for (const cookie of videoCookies) {
        const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteReviewVideoWithId(video.id);
        this.mediaRedundantService.deleteMediaFilesOnServerDisk(
          cookie.fileName,
          "video/review",
        );
      }
    } else {
      const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
        videoCookies[0].url,
      );

      await this.mediaGeneralRepository.deleteReviewVideoWithId(video.id);
      this.mediaRedundantService.deleteMediaFilesOnServerDisk(
        videoCookies[0].fileName,
        "video/review",
      );
    }
  }

  async deleteInquiryImages(imageCookies: ReceiveMediaDto[]): Promise<void> {
    if (imageCookies.length >= 2) {
      for (const cookie of imageCookies) {
        const image = await this.mediaGeneralRepository.findInquiryImageWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteInquiryImageWithId(image.id);
        this.mediaRedundantService.deleteMediaFilesOnServerDisk(
          cookie.fileName,
          "image/inquiry",
        );
      }
    } else {
      const image = await this.mediaGeneralRepository.findInquiryImageWithUrl(
        imageCookies[0].url,
      );

      await this.mediaGeneralRepository.deleteInquiryImageWithId(image.id);
      this.mediaRedundantService.deleteMediaFilesOnServerDisk(
        imageCookies[0].fileName,
        "image/inquiry",
      );
    }
  }

  async deleteInquiryVideos(videoCookies: ReceiveMediaDto[]): Promise<void> {
    if (videoCookies.length >= 2) {
      for (const cookie of videoCookies) {
        const video = await this.mediaGeneralRepository.findInquiryVideoWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteInquiryVideoWithId(video.id);
        this.mediaRedundantService.deleteMediaFilesOnServerDisk(
          cookie.fileName,
          "video/inquiry",
        );
      }
    } else {
      const video = await this.mediaGeneralRepository.findInquiryVideoWithUrl(
        videoCookies[0].url,
      );

      await this.mediaGeneralRepository.deleteInquiryVideoWithId(video.id);
      this.mediaRedundantService.deleteMediaFilesOnServerDisk(
        videoCookies[0].fileName,
        "video/inquiry",
      );
    }
  }
}
