import { Injectable } from "@nestjs/common";
import { JwtAccessTokenPayload } from "../../auth/jwt/jwt-access-token-payload.interface";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { RequestMediaDto } from "../dto/request-media.dto";
import { MediaGeneralRepository } from "../repositories/media-general.repository";
import { MediaAccessoryService } from "./media-accessory.service";

@Injectable()
export class MediaGeneralService {
  constructor(
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly userRepository: UserGeneralRepository,
    private readonly mediaAccessoryService: MediaAccessoryService,
  ) {}

  async uploadProductImage(
    file: Express.Multer.File,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const user = await this.userRepository.findAdminUserProfileInfoWithId(
      jwtPayload.userId,
    );
    const url = this.mediaAccessoryService.setUrl(file.filename);

    await this.mediaGeneralRepository.uploadProductImage({
      url,
      uploader: user.Auth.email,
    });
  }

  async uploadReviewImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void> {
    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      urls.forEach(async (url) => {
        await this.mediaGeneralRepository.uploadReviewImage({
          url,
          uploader: user.Auth.email,
        });
      });
    } else {
      const url = this.mediaAccessoryService.setUrl(files[0].filename);
      await this.mediaGeneralRepository.uploadReviewImage({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadReviewVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void> {
    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      urls.forEach(async (url) => {
        await this.mediaGeneralRepository.uploadReviewVideo({
          url,
          uploader: user.Auth.email,
        });
      });
    } else {
      const url = this.mediaAccessoryService.setUrl(files[0].filename);
      await this.mediaGeneralRepository.uploadReviewVideo({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadInquiryImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void> {
    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      urls.forEach(async (url) => {
        await this.mediaGeneralRepository.uploadInquiryImage({
          url,
          uploader: user.Auth.email,
        });
      });
    } else {
      const url = this.mediaAccessoryService.setUrl(files[0].filename);
      await this.mediaGeneralRepository.uploadInquiryImage({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadInquiryVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void> {
    const user = await this.userRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      urls.forEach(async (url) => {
        await this.mediaGeneralRepository.uploadInquiryVideo({
          url,
          uploader: user.Auth.email,
        });
      });
    } else {
      const url = this.mediaAccessoryService.setUrl(files[0].filename);
      await this.mediaGeneralRepository.uploadInquiryVideo({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async deleteProductImageWithCookies(
    imageCookie: RequestMediaDto,
  ): Promise<void> {
    const image = await this.mediaGeneralRepository.findProductImageWithUrl(
      imageCookie.url,
    );

    await this.mediaGeneralRepository.deleteProductImageWithId(image.id);
  }

  async deleteReviewImagesWithCookies(
    reviewImgCookies: RequestMediaDto[],
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      reviewImgCookies.forEach(async (cookie) => {
        const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteReviewImageWithId(image.id);
      });
    } else {
      const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
        reviewImgCookies[0].url,
      );
      await this.mediaGeneralRepository.deleteReviewImageWithId(image.id);
    }
  }

  async deleteReviewVideosWithCookies(
    reviewVdoCookies: RequestMediaDto[],
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      reviewVdoCookies.forEach(async (cookie) => {
        const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteReviewVideoWithId(video.id);
      });
    } else {
      const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
        reviewVdoCookies[0].url,
      );
      await this.mediaGeneralRepository.deleteReviewVideoWithId(video.id);
    }
  }

  async deleteInquiryImagesWithCookies(
    inquiryImgCookies: RequestMediaDto[],
  ): Promise<void> {
    if (inquiryImgCookies.length >= 2) {
      inquiryImgCookies.forEach(async (cookie) => {
        const image = await this.mediaGeneralRepository.findInquiryImageWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteInquiryImageWithId(image.id);
      });
    } else {
      const image = await this.mediaGeneralRepository.findInquiryImageWithUrl(
        inquiryImgCookies[0].url,
      );

      await this.mediaGeneralRepository.deleteInquiryImageWithId(image.id);
    }
  }

  async deleteInquiryVideosWithCookies(
    inquiryVdoCookies: RequestMediaDto[],
  ): Promise<void> {
    if (inquiryVdoCookies.length >= 2) {
      inquiryVdoCookies.forEach(async (cookie) => {
        const video = await this.mediaGeneralRepository.findInquiryVideoWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteInquiryVideoWithId(video.id);
      });
    } else {
      const video = await this.mediaGeneralRepository.findInquiryVideoWithUrl(
        inquiryVdoCookies[0].url,
      );

      await this.mediaGeneralRepository.deleteInquiryVideoWithId(video.id);
    }
  }
}
