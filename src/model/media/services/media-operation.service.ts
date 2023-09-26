import { Inject, Injectable } from "@nestjs/common";
import { MediaUtils } from "../logic/media.utils";
import { MediaCookieDto } from "../dto/media-cookie.dto";
import { MediaOperationRepository } from "../repositories/media-operation.repository";
import { ProductMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { InquiryMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { ReviewMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";

@Injectable()
export class MediaOperationService {
  constructor(
    @Inject("ProductMediaCookieKey")
    private readonly productMedia: ProductMediaCookieKey,
    @Inject("ReviewMediaCookieKey")
    private readonly reviewMedia: ReviewMediaCookieKey,
    @Inject("InquiryMediaCookieKey")
    private readonly inquiryMedia: InquiryMediaCookieKey,
    private readonly mediaUtils: MediaUtils,
    private readonly mediaOperationRepository: MediaOperationRepository,
  ) {}

  // General
  public async uploadProductImages(
    files: Express.Multer.File[],
  ): Promise<MediaCookieDto[]> {
    const path = "product/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(async ({ url, size }) => {
      return await this.mediaOperationRepository.uploadProductImages({
        url,
        size,
      });
    });

    const productImages = await Promise.all(uploading);

    const ids = productImages.map((productImage) => productImage.id);

    return this.mediaUtils.getMediaCookies(
      ids,
      files,
      path,
      this.productMedia.image_url_cookie,
    );
  }

  // General
  public async uploadReviewImages(
    files: Express.Multer.File[],
  ): Promise<MediaCookieDto[]> {
    const path = "review/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(async ({ url, size }) => {
      return await this.mediaOperationRepository.uploadReviewImage({
        url,
        size,
      });
    });

    const reviewImages = await Promise.all(uploading);

    const ids = reviewImages.map((reviewImage) => reviewImage.id);

    return this.mediaUtils.getMediaCookies(
      ids,
      files,
      path,
      this.reviewMedia.image_url_cookie,
    );
  }

  // General
  public async uploadReviewVideos(
    files: Express.Multer.File[],
  ): Promise<MediaCookieDto[]> {
    const path = "review/videos";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(async ({ url, size }) => {
      return await this.mediaOperationRepository.uploadReviewVideo({
        url,
        size,
      });
    });

    const reviewVideos = await Promise.all(uploading);

    const ids = reviewVideos.map((reviewVideo) => reviewVideo.id);

    return this.mediaUtils.getMediaCookies(
      ids,
      files,
      path,
      this.reviewMedia.video_url_cookie,
    );
  }

  // General
  public async uploadInquiryRequestImages(
    files: Express.Multer.File[],
  ): Promise<MediaCookieDto[]> {
    const path = "inquiry/request/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(async ({ url, size }) => {
      return await this.mediaOperationRepository.uploadInquiryRequestImage({
        url,
        size,
      });
    });

    const inquiryRequestImages = await Promise.all(uploading);

    const ids = inquiryRequestImages.map(
      (inquiryRequestImage) => inquiryRequestImage.id,
    );

    return this.mediaUtils.getMediaCookies(
      ids,
      files,
      path,
      this.inquiryMedia.request.image_url_cookie,
    );
  }

  // General
  public async uploadInquiryRequestVideos(
    files: Express.Multer.File[],
  ): Promise<MediaCookieDto[]> {
    const path = "inquiry/request/videos";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(async ({ url, size }) => {
      return await this.mediaOperationRepository.uploadInquiryRequestVideo({
        url,
        size,
      });
    });

    const inquiryRequestVideos = await Promise.all(uploading);

    const ids = inquiryRequestVideos.map(
      (inquiryRequestVideo) => inquiryRequestVideo.id,
    );

    return this.mediaUtils.getMediaCookies(
      ids,
      files,
      path,
      this.inquiryMedia.request.video_url_cookie,
    );
  }

  // General
  public async uploadInquiryResponseImages(
    files: Express.Multer.File[],
  ): Promise<MediaCookieDto[]> {
    const path = "inquiry/response/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(async ({ url, size }) => {
      return await this.mediaOperationRepository.uploadInquiryResponseImages({
        url,
        size,
      });
    });

    const inquiryResponseImages = await Promise.all(uploading);

    const ids = inquiryResponseImages.map(
      (inquiryResponseImage) => inquiryResponseImage.id,
    );

    return this.mediaUtils.getMediaCookies(
      ids,
      files,
      path,
      this.inquiryMedia.response.image_url_cookie,
    );
  }

  // General
  public async uploadInquiryResponseVideos(
    files: Express.Multer.File[],
  ): Promise<MediaCookieDto[]> {
    const path = "inquiry/response/videos";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(async ({ url, size }) => {
      return await this.mediaOperationRepository.uploadInquiryResponseVideos({
        url,
        size,
      });
    });

    const inquiryResponseVideos = await Promise.all(uploading);

    const ids = inquiryResponseVideos.map(
      (inquiryResponseVideo) => inquiryResponseVideo.id,
    );

    return this.mediaUtils.getMediaCookies(
      ids,
      files,
      path,
      this.inquiryMedia.response.video_url_cookie,
    );
  }

  // General
  public async deleteProductImagesWithId(
    productImgCookies: MediaCookieDto[],
  ): Promise<string[]> {
    const deleting = productImgCookies.map(async (productImgCookie) => {
      await this.mediaOperationRepository.deleteProductImageWithId(
        productImgCookie.id,
      );
    });

    // this.mediaBundleService.deleteMediaFile(
    //   productImgCookies,
    //   "images/product",
    // );

    await Promise.all(deleting);

    return productImgCookies.map(
      (productImgCookie) => productImgCookie.whatCookie,
    );
  }

  // General
  public async deleteReviewImagesWithId(
    reviewImgCookies: MediaCookieDto[],
  ): Promise<string[]> {
    const deleting = reviewImgCookies.map(
      async (reviewImgCookie: MediaCookieDto) => {
        await this.mediaOperationRepository.deleteReviewImageWithId(
          reviewImgCookie.id,
        );
      },
    );

    // this.mediaBundleService.deleteMediaFile(
    //   reviewImgCookies,
    //   "images/review",
    // );

    await Promise.all(deleting);

    return reviewImgCookies.map(
      (reviewImgCookie) => reviewImgCookie.whatCookie,
    );
  }

  // General
  public async deleteReviewVideosWithId(
    reviewVdoCookies: MediaCookieDto[],
  ): Promise<string[]> {
    const deleting = reviewVdoCookies.map(
      async (reviewVdoCookie: MediaCookieDto) => {
        await this.mediaOperationRepository.deleteReviewVideoWithId(
          reviewVdoCookie.id,
        );
      },
    );

    // this.mediaBundleService.deleteMediaFile(
    //   reviewVdoCookies,
    //   "videos/review",
    // );

    await Promise.all(deleting);

    return reviewVdoCookies.map(
      (reviewVdoCookie) => reviewVdoCookie.whatCookie,
    );
  }

  // General
  public async deleteInquiryRequestImagesWithId(
    inquiryRequestImgCookies: MediaCookieDto[],
  ): Promise<string[]> {
    const deleting = inquiryRequestImgCookies.map(
      async (inquiryRequestImgCookie) => {
        await this.mediaOperationRepository.deleteInquiryRequestImageWithId(
          inquiryRequestImgCookie.id,
        );
      },
    );

    // this.mediaBundleService.deleteMediaFile(
    //   inquiryRequestImgCookies,
    //   "images/inquiry/request",
    // );

    await Promise.all(deleting);

    return inquiryRequestImgCookies.map(
      (inquiryRequestImgCookie) => inquiryRequestImgCookie.whatCookie,
    );
  }

  // General
  public async deleteInquiryRequestVideosWithId(
    inquiryRequestVdoCookies: MediaCookieDto[],
  ): Promise<string[]> {
    const deleting = inquiryRequestVdoCookies.map(
      async (inquiryRequestVdoCookie) => {
        await this.mediaOperationRepository.deleteInquiryRequestVideoWithId(
          inquiryRequestVdoCookie.id,
        );
      },
    );

    // this.mediaBundleService.deleteMediaFile(
    //   inquiryRequestVdoCookies,
    //   "videos/inquiry/request",
    // );

    await Promise.all(deleting);

    return inquiryRequestVdoCookies.map(
      (inquiryRequestVdoCookie) => inquiryRequestVdoCookie.whatCookie,
    );
  }

  // General
  public async deleteInquiryResponseImagesWithId(
    inquiryResponseImgCookies: MediaCookieDto[],
  ): Promise<string[]> {
    const deleting = inquiryResponseImgCookies.map(
      async (inquiryResponseImgCookie) => {
        await this.mediaOperationRepository.deleteInquiryResponseImageWithId(
          inquiryResponseImgCookie.id,
        );
      },
    );

    // this.mediaBundleService.deleteMediaFile(
    //   inquiryResponseImgCookies,
    //   "images/inquiry/response",
    // );

    await Promise.all(deleting);

    return inquiryResponseImgCookies.map(
      (inquiryResponseImgCookie) => inquiryResponseImgCookie.whatCookie,
    );
  }

  // General
  public async deleteInquiryResponseVideosWithId(
    inquiryResponseVdoCookies: MediaCookieDto[],
  ): Promise<string[]> {
    const deleting = inquiryResponseVdoCookies.map(
      async (inquiryResponseVdoCookie) => {
        await this.mediaOperationRepository.deleteInquiryResponseVideoWithId(
          inquiryResponseVdoCookie.id,
        );
      },
    );

    // this.mediaBundleService.deleteMediaFile(
    //   inquiryResponseVdoCookies,
    //   "videos/inquiry/response",
    // );

    await Promise.all(deleting);

    return inquiryResponseVdoCookies.map(
      (inquiryResponseVdoCookie) => inquiryResponseVdoCookie.whatCookie,
    );
  }
}
