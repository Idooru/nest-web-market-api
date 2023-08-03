import { Injectable } from "@nestjs/common";
import { JwtAccessTokenPayload } from "../../auth/jwt/jwt-access-token-payload.interface";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { MediaGeneralRepository } from "../repositories/media-general.repository";
import { MediaDto } from "../dto/media.dto";
import { ProductImageEntity } from "../entities/product-image.entity";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";
import { ReviewImageEntity } from "../entities/review-image.entity";
import { ReviewVideoEntity } from "../entities/review-video.entity";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { IMediaGeneralService } from "../interfaces/services/media-general-service.interface";

@Injectable()
export class MediaGeneralService implements IMediaGeneralService {
  constructor(
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
  ) {}

  async findUploadedProductImages(
    email: string,
    productImages: ProductImageEntity[],
  ): Promise<ProductImageEntity[]> {
    if (productImages.length >= 2) {
      const promises = productImages.map(async (productImage) => {
        return await this.mediaGeneralRepository.findUploadedProductImage(
          email,
          productImage.url,
        );
      });

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findUploadedProductImage(
          email,
          productImages[0].url,
        ),
      ];
    }
  }

  async findUploadedReviewImages(
    email: string,
    reviewImages: ReviewImageEntity[],
  ): Promise<ReviewImageEntity[]> {
    if (reviewImages.length >= 2) {
      const promises = reviewImages.map(async (reviewImage) => {
        return await this.mediaGeneralRepository.findUploadedReviewImages(
          email,
          reviewImage.url,
        );
      });

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findUploadedReviewImages(
          email,
          reviewImages[0].url,
        ),
      ];
    }
  }

  async findUploadedReviewVideos(
    email: string,
    reviewVideos: ReviewVideoEntity[],
  ): Promise<ReviewVideoEntity[]> {
    if (reviewVideos.length >= 2) {
      const promoises = reviewVideos.map(async (reviewVideo) => {
        return await this.mediaGeneralRepository.findUploadedReviewVideos(
          email,
          reviewVideo.url,
        );
      });

      return await Promise.all(promoises);
    } else {
      return [
        await this.mediaGeneralRepository.findUploadedReviewVideos(
          email,
          reviewVideos[0].url,
        ),
      ];
    }
  }

  async findUploadedInquiryRequestImages(
    email: string,
    inquiryReqeustImages: InquiryRequestImageEntity[],
  ): Promise<InquiryRequestImageEntity[]> {
    if (inquiryReqeustImages.length >= 2) {
      const promises = inquiryReqeustImages.map(async (inquiryRequestImage) => {
        return await this.mediaGeneralRepository.findUploadedInquiryReqeustImages(
          email,
          inquiryRequestImage.url,
        );
      });

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findUploadedInquiryReqeustImages(
          email,
          inquiryReqeustImages[0].url,
        ),
      ];
    }
  }

  async findUploadedInquiryRequestVideos(
    email: string,
    inquiryReqeustVideos: InquiryRequestVideoEntity[],
  ): Promise<InquiryRequestImageEntity[]> {
    if (inquiryReqeustVideos.length >= 2) {
      const promises = inquiryReqeustVideos.map(async (inquiryRequestVideo) => {
        return await this.mediaGeneralRepository.findUploadedInquiryReqeustVideos(
          email,
          inquiryRequestVideo.url,
        );
      });

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findUploadedInquiryReqeustImages(
          email,
          inquiryReqeustVideos[0].url,
        ),
      ];
    }
  }

  async findUploadedInquiryResponseImages(
    email: string,
    inquiryResponseImages: InquiryResponseImageEntity[],
  ): Promise<InquiryResponseImageEntity[]> {
    if (inquiryResponseImages.length >= 2) {
      const promises = inquiryResponseImages.map(
        async (inquiryResponseImage) => {
          return await this.mediaGeneralRepository.findUploadedInquiryResponseImages(
            email,
            inquiryResponseImage.url,
          );
        },
      );

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findUploadedInquiryResponseImages(
          email,
          inquiryResponseImages[0].url,
        ),
      ];
    }
  }

  async findUploadedInquiryResponseVideos(
    email: string,
    inquiryResponseVideos: InquiryResponseVideoEntity[],
  ): Promise<InquiryResponseVideoEntity[]> {
    if (inquiryResponseVideos.length >= 2) {
      const promises = inquiryResponseVideos.map(
        async (inquiryResponseVideo) => {
          return await this.mediaGeneralRepository.findUploadedInquiryResponseVideos(
            email,
            inquiryResponseVideo.url,
          );
        },
      );

      return await Promise.all(promises);
    } else {
    }
  }

  async uploadProductsImage(
    files: Array<Express.Multer.File>,
    jwtPayload: JwtAccessTokenPayload,
    urls: string[],
  ): Promise<void> {
    const user =
      await this.userGeneralRepository.findAdminUserProfileInfoWithId(
        jwtPayload.userId,
      );

    if (files.length >= 2) {
      const promises = urls.map(async (url) => {
        await this.mediaGeneralRepository.uploadProductImage({
          url,
          uploader: user.Auth.email,
        });
      });

      await Promise.all(promises);
    } else {
      const url = urls[0];

      await this.mediaGeneralRepository.uploadProductImage({
        url,
        uploader: user.Auth.email,
      });
    }
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
      const url = urls[0];

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
      const url = urls[0];

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
      const url = urls[0];

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
      const url = urls[0];

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
      const url = urls[0];

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
      const url = urls[0];

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
          await this.mediaGeneralRepository.findInquiryRequestVideoWithUrl(
            cookie.url,
          );
        await this.mediaGeneralRepository.deleteInquiryRequestVideoWIthId(
          video.id,
        );
      });

      await Promise.all(promises);
    } else {
      const video =
        await this.mediaGeneralRepository.findInquiryRequestVideoWithUrl(
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
