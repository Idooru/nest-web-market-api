import { Inject, Injectable } from "@nestjs/common";
import { MediaUtils } from "../logic/media.utils";
import { MediaUpdateRepository } from "../repositories/media-update.repository";
import { ProductMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { InquiryMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { ReviewMediaCookieKey } from "../../../common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { General } from "../../../common/decorators/general.decoration";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";

@Injectable()
export class MediaService {
  constructor(
    @Inject("product-media-cookie-key")
    private readonly productMedia: ProductMediaCookieKey,
    @Inject("review-media-cookie-key")
    private readonly reviewMedia: ReviewMediaCookieKey,
    @Inject("inquiry-media-cookie-key")
    private readonly inquiryMedia: InquiryMediaCookieKey,
    private readonly mediaUtils: MediaUtils,
    private readonly updateRepository: MediaUpdateRepository,
  ) {}

  @General
  public async uploadProductImages(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "product/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);
    const uploading = stuffs.map((stuff) => this.updateRepository.uploadProductImages(stuff));
    const productImages = await Promise.all(uploading);
    const ids = productImages.map((productImage) => productImage.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.productMedia.imageUrlCookie);
  }

  @General
  public async uploadReviewImages(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "review/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);
    const uploading = stuffs.map((stuff) => this.updateRepository.uploadReviewImage(stuff));
    const reviewImages = await Promise.all(uploading);
    const ids = reviewImages.map((reviewImage) => reviewImage.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.reviewMedia.imageUrlCookie);
  }

  @General
  public async uploadReviewVideos(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "review/videos";
    const stuffs = this.mediaUtils.createStuffs(files, path);
    const uploading = stuffs.map((stuff) => this.updateRepository.uploadReviewVideo(stuff));
    const reviewVideos = await Promise.all(uploading);
    const ids = reviewVideos.map((reviewVideo) => reviewVideo.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.reviewMedia.videoUrlCookie);
  }

  @General
  public async uploadInquiryRequestImages(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "inquiry/request/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);
    const uploading = stuffs.map((stuff) => this.updateRepository.uploadInquiryRequestImage(stuff));
    const inquiryRequestImages = await Promise.all(uploading);
    const ids = inquiryRequestImages.map((inquiryRequestImage) => inquiryRequestImage.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.inquiryMedia.request.imageUrlCookie);
  }

  @General
  public async uploadInquiryRequestVideos(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "inquiry/request/videos";
    const stuffs = this.mediaUtils.createStuffs(files, path);
    const uploading = stuffs.map((stuff) => this.updateRepository.uploadInquiryRequestVideo(stuff));
    const inquiryRequestVideos = await Promise.all(uploading);
    const ids = inquiryRequestVideos.map((inquiryRequestVideo) => inquiryRequestVideo.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.inquiryMedia.request.videoUrlCookie);
  }

  @General
  public async uploadInquiryResponseImages(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "inquiry/response/images";
    const stuffs = this.mediaUtils.createStuffs(files, path);
    const uploading = stuffs.map((stuff) => this.updateRepository.uploadInquiryResponseImages(stuff));
    const inquiryResponseImages = await Promise.all(uploading);
    const ids = inquiryResponseImages.map((inquiryResponseImage) => inquiryResponseImage.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.inquiryMedia.response.imageUrlCookie);
  }

  @General
  public async uploadInquiryResponseVideos(files: Express.Multer.File[]): Promise<MediaCookieDto[]> {
    const path = "inquiry/response/videos";
    const stuffs = this.mediaUtils.createStuffs(files, path);
    const uploading = stuffs.map((stuff) => this.updateRepository.uploadInquiryResponseVideos(stuff));
    const inquiryResponseVideos = await Promise.all(uploading);
    const ids = inquiryResponseVideos.map((inquiryResponseVideo) => inquiryResponseVideo.id);

    return this.mediaUtils.getMediaCookies(ids, files, path, this.inquiryMedia.response.videoUrlCookie);
  }

  @General
  public async deleteProductImagesWithId(cookies: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookies.map((productImgCookie) =>
      this.updateRepository.deleteProductImageWithId(productImgCookie.id),
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
      this.updateRepository.deleteReviewImageWithId(reviewImgCookie.id),
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
      this.updateRepository.deleteReviewVideoWithId(reviewVdoCookie.id),
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
      this.updateRepository.deleteInquiryRequestImageWithId(inquiryRequestImgCookie.id),
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
  public async deleteInquiryRequestVideosWithId(cookies: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookies.map((inquiryRequestVdoCookie) =>
      this.updateRepository.deleteInquiryRequestVideoWithId(inquiryRequestVdoCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      videos: cookies.map((vdo) => ({ url: vdo.fileName })),
      mediaEntity: "inquiry",
      option: "request",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookies.map((inquiryRequestVdoCookie) => inquiryRequestVdoCookie.whatCookie);
  }

  @General
  public async deleteInquiryResponseImagesWithId(cookies: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookies.map((inquiryResponseImgCookie) =>
      this.updateRepository.deleteInquiryResponseImageWithId(inquiryResponseImgCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      images: cookies.map((img) => ({ url: img.fileName })),
      mediaEntity: "inquiry",
      option: "response",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookies.map((inquiryResponseImgCookie) => inquiryResponseImgCookie.whatCookie);
  }

  @General
  public async deleteInquiryResponseVideosWithId(cookies: MediaCookieDto[]): Promise<string[]> {
    const deleting = cookies.map((inquiryResponseVdoCookie) =>
      this.updateRepository.deleteInquiryResponseVideoWithId(inquiryResponseVdoCookie.id),
    );

    this.mediaUtils.deleteMediaFiles({
      videos: cookies.map((vdo) => ({ url: vdo.fileName })),
      mediaEntity: "inquiry",
      option: "response",
      callWhere: "cancel upload",
    });

    await Promise.all(deleting);

    return cookies.map((inquiryResponseVdoCookie) => inquiryResponseVdoCookie.whatCookie);
  }
}
