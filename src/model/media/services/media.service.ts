import { Inject, Injectable } from "@nestjs/common";
import { MediaUtils } from "../logic/media.utils";
import { MediaCookieDto } from "../dto/media-cookie.dto";
import { MediaUpdateRepository } from "../repositories/media-update.repository";
import { ProductMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { InquiryMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { ReviewMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { General } from "../../../common/decorators/general.decoration";

@Injectable()
export class MediaService {
  constructor(
    @Inject("ProductMediaCookieKey")
    private readonly productMedia: ProductMediaCookieKey,
    @Inject("ReviewMediaCookieKey")
    private readonly reviewMedia: ReviewMediaCookieKey,
    @Inject("InquiryMediaCookieKey")
    private readonly inquiryMedia: InquiryMediaCookieKey,
    private readonly mediaUtils: MediaUtils,
    private readonly mediaOperationRepository: MediaUpdateRepository,
  ) {}

  @General
  public async uploadProductImages(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "product/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(({ url, size }) =>
      this.mediaOperationRepository.uploadProductImages({
        url,
        size,
      }),
    );

    const productImages = await Promise.all(uploading);

    const ids = productImages.map((productImage) => productImage.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.productMedia.image_url_cookie);
  }

  @General
  public async uploadReviewImages(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "review/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(({ url, size }) =>
      this.mediaOperationRepository.uploadReviewImage({
        url,
        size,
      }),
    );

    const reviewImages = await Promise.all(uploading);

    const ids = reviewImages.map((reviewImage) => reviewImage.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.reviewMedia.image_url_cookie);
  }

  @General
  public async uploadReviewVideos(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "review/videos";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(({ url, size }) =>
      this.mediaOperationRepository.uploadReviewVideo({
        url,
        size,
      }),
    );

    const reviewVideos = await Promise.all(uploading);

    const ids = reviewVideos.map((reviewVideo) => reviewVideo.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.reviewMedia.video_url_cookie);
  }

  @General
  public async uploadInquiryRequestImages(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "inquiry/request/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(({ url, size }) =>
      this.mediaOperationRepository.uploadInquiryRequestImage({
        url,
        size,
      }),
    );

    const inquiryRequestImages = await Promise.all(uploading);

    const ids = inquiryRequestImages.map((inquiryRequestImage) => inquiryRequestImage.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.inquiryMedia.request.image_url_cookie);
  }

  @General
  public async uploadInquiryRequestVideos(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "inquiry/request/videos";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(({ url, size }) =>
      this.mediaOperationRepository.uploadInquiryRequestVideo({
        url,
        size,
      }),
    );

    const inquiryRequestVideos = await Promise.all(uploading);

    const ids = inquiryRequestVideos.map((inquiryRequestVideo) => inquiryRequestVideo.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.inquiryMedia.request.video_url_cookie);
  }

  @General
  public async uploadInquiryResponseImages(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "inquiry/response/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(({ url, size }) =>
      this.mediaOperationRepository.uploadInquiryResponseImages({
        url,
        size,
      }),
    );

    const inquiryResponseImages = await Promise.all(uploading);

    const ids = inquiryResponseImages.map((inquiryResponseImage) => inquiryResponseImage.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.inquiryMedia.response.image_url_cookie);
  }

  @General
  public async uploadInquiryResponseVideos(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "inquiry/response/videos";
    const stuffs = this.mediaUtils.createStuffs(files, path);

    const uploading = stuffs.map(({ url, size }) =>
      this.mediaOperationRepository.uploadInquiryResponseVideos({
        url,
        size,
      }),
    );

    const inquiryResponseVideos = await Promise.all(uploading);

    const ids = inquiryResponseVideos.map((inquiryResponseVideo) => inquiryResponseVideo.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.inquiryMedia.response.video_url_cookie);
  }

  @General
  public async deleteProductImagesWithId(cookies: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookies.map((productImgCookie) =>
      this.mediaOperationRepository.deleteProductImageWithId(productImgCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      images: cookies.map((img) => ({ url: img.fileName })),
      mediaEntity: "product",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookies.map((productImgCookie) => productImgCookie.whatCookie);
  }

  @General
  public async deleteReviewImagesWithId(cookies: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookies.map((reviewImgCookie) =>
      this.mediaOperationRepository.deleteReviewImageWithId(reviewImgCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      images: cookies.map((img) => ({ url: img.fileName })),
      mediaEntity: "review",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookies.map((reviewImgCookie) => reviewImgCookie.whatCookie);
  }

  @General
  public async deleteReviewVideosWithId(cookies: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookies.map((reviewVdoCookie) =>
      this.mediaOperationRepository.deleteReviewVideoWithId(reviewVdoCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      videos: cookies.map((vdo) => ({ url: vdo.fileName })),
      mediaEntity: "review",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookies.map((reviewVdoCookie) => reviewVdoCookie.whatCookie);
  }

  @General
  public async deleteInquiryRequestImagesWithId(cookies: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookies.map((inquiryRequestImgCookie) =>
      this.mediaOperationRepository.deleteInquiryRequestImageWithId(inquiryRequestImgCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      images: cookies.map((img) => ({ url: img.fileName })),
      mediaEntity: "inquiry",
      option: "request",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookies.map((inquiryRequestImgCookie) => inquiryRequestImgCookie.whatCookie);
  }

  @General
  public async deleteInquiryRequestVideosWithId(cookeis: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookeis.map((inquiryRequestVdoCookie) =>
      this.mediaOperationRepository.deleteInquiryRequestVideoWithId(inquiryRequestVdoCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      videos: cookeis.map((vdo) => ({ url: vdo.fileName })),
      mediaEntity: "inquiry",
      option: "request",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookeis.map((inquiryRequestVdoCookie) => inquiryRequestVdoCookie.whatCookie);
  }

  @General
  public async deleteInquiryResponseImagesWithId(cookeis: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookeis.map((inquiryResponseImgCookie) =>
      this.mediaOperationRepository.deleteInquiryResponseImageWithId(inquiryResponseImgCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      images: cookeis.map((img) => ({ url: img.fileName })),
      mediaEntity: "inquiry",
      option: "response",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookeis.map((inquiryResponseImgCookie) => inquiryResponseImgCookie.whatCookie);
  }

  @General
  public async deleteInquiryResponseVideosWithId(cookeis: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookeis.map((inquiryResponseVdoCookie) =>
      this.mediaOperationRepository.deleteInquiryResponseVideoWithId(inquiryResponseVdoCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      videos: cookeis.map((vdo) => ({ url: vdo.fileName })),
      mediaEntity: "inquiry",
      option: "response",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookeis.map((inquiryResponseVdoCookie) => inquiryResponseVdoCookie.whatCookie);
  }
}
