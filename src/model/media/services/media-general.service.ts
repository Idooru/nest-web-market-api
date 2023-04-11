import { Injectable } from "@nestjs/common";
import { JwtAccessTokenPayload } from "../../auth/jwt/jwt-access-token-payload.interface";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { MediaGeneralRepository } from "../repositories/media-general.repository";
import { MediaAccessoryService } from "./media-accessory.service";
import { MediaDto } from "../dto/media.dto";
import { ProductImageEntity } from "../entities/product.image.entity";

@Injectable()
export class MediaGeneralService {
  constructor(
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly mediaAccessoryService: MediaAccessoryService,
  ) {}

  async findUploadedProductImage(
    email: string,
    url: string,
  ): Promise<ProductImageEntity> {
    return await this.mediaGeneralRepository.findUploadedProductImage(
      email,
      url,
    );
  }

  async uploadProductImage(
    file: Express.Multer.File,
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<void> {
    const user =
      await this.userGeneralRepository.findAdminUserProfileInfoWithId(
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
    const user = await this.userGeneralRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      const promises = urls.map(async (url: string) => {
        await this.mediaGeneralRepository.uploadReviewImage({
          url,
          uploader: user.Auth.email,
        });
      });

      await Promise.all(promises);
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
    const user = await this.userGeneralRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      const promoises = urls.map(async (url: string) => {
        await this.mediaGeneralRepository.uploadReviewVideo({
          url,
          uploader: user.Auth.email,
        });
      });

      await Promise.all(promoises);
    } else {
      const url = this.mediaAccessoryService.setUrl(files[0].filename);

      await this.mediaGeneralRepository.uploadReviewVideo({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadInquiryRequestImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      const promises = urls.map(async (url: string) => {
        await this.mediaGeneralRepository.uploadInquiryRequestImage({
          url,
          uploader: user.Auth.email,
        });
      });

      await Promise.all(promises);
    } else {
      const url = this.mediaAccessoryService.setUrl(files[0].filename);

      await this.mediaGeneralRepository.uploadInquiryRequestImage({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadInquiryRequestVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      const promises = urls.map(async (url: string) => {
        await this.mediaGeneralRepository.uploadInquiryRequestVideo({
          url,
          uploader: user.Auth.email,
        });
      });

      await Promise.all(promises);
    } else {
      const url = this.mediaAccessoryService.setUrl(files[0].filename);

      await this.mediaGeneralRepository.uploadInquiryRequestVideo({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadInquiryResponseImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      const promises = urls.map(async (url: string) => {
        await this.mediaGeneralRepository.uploadInquiryResponseImage({
          url,
          uploader: user.Auth.email,
        });
      });

      await Promise.all(promises);
    } else {
      const url = this.mediaAccessoryService.setUrl(files[0].filename);

      await this.mediaGeneralRepository.uploadInquiryResponseImage({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async uploadInquiryResponseVideo(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithNickName(
      jwtPayload.nickname,
    );

    if (files.length >= 2) {
      const promises = urls.map(async (url: string) => {
        await this.mediaGeneralRepository.uploadInquiryResponseVideo({
          url,
          uploader: user.Auth.email,
        });

        await Promise.all(promises);
      });
    } else {
      const url = this.mediaAccessoryService.setUrl(files[0].filename);

      await this.mediaGeneralRepository.uploadInquiryResponseVideo({
        url,
        uploader: user.Auth.email,
      });
    }
  }

  async deleteProductImageWithCookies(imageCookie: MediaDto): Promise<void> {
    const image = await this.mediaGeneralRepository.findProductImageWithUrl(
      imageCookie.url,
    );

    await this.mediaGeneralRepository.deleteProductImageWithId(image.id);
  }

  async deleteReviewImagesWithCookies(
    reviewImgCookies: MediaDto[],
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      const promises = reviewImgCookies.map(async (cookie) => {
        const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteReviewImageWithId(image.id);
      });

      await Promise.all(promises);
    } else {
      const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
        reviewImgCookies[0].url,
      );

      await this.mediaGeneralRepository.deleteReviewImageWithId(image.id);
    }
  }

  async deleteReviewVideosWithCookies(
    reviewVdoCookies: MediaDto[],
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      const promises = reviewVdoCookies.map(async (cookie) => {
        const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
          cookie.url,
        );
        await this.mediaGeneralRepository.deleteReviewVideoWithId(video.id);
      });

      await Promise.all(promises);
    } else {
      const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
        reviewVdoCookies[0].url,
      );

      await this.mediaGeneralRepository.deleteReviewVideoWithId(video.id);
    }
  }

  async deleteInquiryRequestImagesWithCookies(
    inquiryRequestImgCookies: MediaDto[],
  ): Promise<void> {
    if (inquiryRequestImgCookies.length >= 2) {
      const promises = inquiryRequestImgCookies.map(async (cookie) => {
        const image =
          await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
            cookie.url,
          );
        await this.mediaGeneralRepository.deleteInquiryRequestImageWithId(
          image.id,
        );
      });

      await Promise.all(promises);
    } else {
      const image =
        await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
          inquiryRequestImgCookies[0].url,
        );

      await this.mediaGeneralRepository.deleteInquiryRequestImageWithId(
        image.id,
      );
    }
  }

  async deleteInquiryRequestVideosWithCookies(
    inquiryRequestVdoCookies: MediaDto[],
  ): Promise<void> {
    if (inquiryRequestVdoCookies.length >= 2) {
      const promises = inquiryRequestVdoCookies.map(async (cookie) => {
        const video =
          await this.mediaGeneralRepository.findInquiryReuqestVideoWithUrl(
            cookie.url,
          );
        await this.mediaGeneralRepository.deleteInquiryRequestVideoWIthId(
          video.id,
        );
      });

      await Promise.all(promises);
    } else {
      const video =
        await this.mediaGeneralRepository.findInquiryReuqestVideoWithUrl(
          inquiryRequestVdoCookies[0].url,
        );

      await this.mediaGeneralRepository.deleteInquiryRequestVideoWIthId(
        video.id,
      );
    }
  }

  async deleteInquiryResponseImagesWithCookies(
    inquiryResponseImgCookies: MediaDto[],
  ): Promise<void> {
    if (inquiryResponseImgCookies.length >= 2) {
      const promises = inquiryResponseImgCookies.map(async (cookie) => {
        const image =
          await this.mediaGeneralRepository.findInquiryResponseImageWithUrl(
            cookie.url,
          );
        await this.mediaGeneralRepository.deleteInquiryResponseImageWithId(
          image.id,
        );
      });

      await Promise.all(promises);
    } else {
      const image =
        await this.mediaGeneralRepository.findInquiryResponseImageWithUrl(
          inquiryResponseImgCookies[0].url,
        );

      await this.mediaGeneralRepository.deleteInquiryResponseImageWithId(
        image.id,
      );
    }
  }

  async deleteInquiryResponseVideosWithCookies(
    inquiryResponseVdoCookies: MediaDto[],
  ): Promise<void> {
    if (inquiryResponseVdoCookies.length >= 2) {
      const promises = inquiryResponseVdoCookies.map(async (cookie) => {
        const video =
          await this.mediaGeneralRepository.findInquiryResponseVideoWithUrl(
            cookie.url,
          );
        await this.mediaGeneralRepository.deleteInquiryResponseVideoWithId(
          video.id,
        );
      });

      await Promise.all(promises);
    } else {
      const video =
        await this.mediaGeneralRepository.findInquiryResponseVideoWithUrl(
          inquiryResponseVdoCookies[0].url,
        );

      await this.mediaGeneralRepository.deleteInquiryResponseVideoWithId(
        video.id,
      );
    }
  }
}
