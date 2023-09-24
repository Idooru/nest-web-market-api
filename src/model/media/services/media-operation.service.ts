import { Inject, Injectable } from "@nestjs/common";
import { MediaUtils } from "../logic/media.utils";
import { MediaCookieDto } from "../dto/media-cookie.dto";
import { MediaOperationRepository } from "../repositories/media-operation.repository";
import { ProductMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { InquiryMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";

@Injectable()
export class MediaOperationService {
  constructor(
    @Inject("ProductMediaCookieKey")
    private readonly productMedia: ProductMediaCookieKey,
    @Inject("InquiryMediaCookieKey")
    private readonly inquiryMedia: InquiryMediaCookieKey,
    private readonly mediaUtils: MediaUtils,
    private readonly mediaOperationRepository: MediaOperationRepository,
  ) {}

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

  public async deleteProductImagesWithIds(
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

  public async deleteInquiryResponseImagesWithIds(
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

  public async deleteInquiryResponseVideosWithIds(
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
