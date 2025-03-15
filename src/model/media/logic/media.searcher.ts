import { Injectable } from "@nestjs/common";
import { ProductImageEntity } from "../entities/product-image.entity";
import { MediaCookieDto } from "../dto/media-cookie.dto";
import { MediaSearchRepository } from "../repositories/media-search.repository";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { ReviewImageEntity } from "../entities/review-image.entity";
import { ReviewVideoEntity } from "../entities/review-video.entity";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";

@Injectable()
export class MediaSearcher {
  constructor(private readonly mediaSearchRepository: MediaSearchRepository) {}

  public findProductImageWithId(productImgCookies: MediaCookieDto[]): Promise<ProductImageEntity[]> {
    const finding = productImgCookies.map((productImgCookie) => {
      return this.mediaSearchRepository.findProductImageWithId(productImgCookie.id);
    });

    return Promise.all(finding);
  }

  public findBeforeProductImages(productId: string): Promise<ProductImageEntity[]> {
    return this.mediaSearchRepository.findBeforeProductImages(productId);
  }

  public findReviewImagesWithId(reviewImgCookies: MediaCookieDto[]): Promise<ReviewImageEntity[]> {
    const finding = reviewImgCookies.map((reviewImgCookie) => {
      return this.mediaSearchRepository.findReviewImageWithId(reviewImgCookie.id);
    });

    return Promise.all(finding);
  }

  public findBeforeReviewImagesWithId(id: string): Promise<ReviewImageEntity[]> {
    return this.mediaSearchRepository.findBeforeReviewImagesWithId(id);
  }

  public findReviewVideosWithId(reviewVdoCookies: MediaCookieDto[]): Promise<ReviewVideoEntity[]> {
    const finding = reviewVdoCookies.map((reviewVdoCookie) => {
      return this.mediaSearchRepository.findReviewVideoWithId(reviewVdoCookie.id);
    });

    return Promise.all(finding);
  }

  public findBeforeReviewVideosWithId(id: string): Promise<ReviewVideoEntity[]> {
    return this.mediaSearchRepository.findBeforeReviewVideosWithId(id);
  }

  public findInquiryRequestImagesWithId(imageCookies: MediaCookieDto[]): Promise<InquiryRequestImageEntity[]> {
    const finding = imageCookies.map((inquiryRequestImgCookie) => {
      return this.mediaSearchRepository.findInquiryRequestImageWithId(inquiryRequestImgCookie.id);
    });

    return Promise.all(finding);
  }

  public findInquiryRequestVideosWithId(videoCookies: MediaCookieDto[]): Promise<InquiryRequestVideoEntity[]> {
    const finding = videoCookies.map((inquiryRequestVdoCookie) => {
      return this.mediaSearchRepository.findInquiryRequestVideoWithId(inquiryRequestVdoCookie.id);
    });

    return Promise.all(finding);
  }

  public findInquiryResponseImagesWithId(
    inquiryResponseImgCookies: MediaCookieDto[],
  ): Promise<InquiryResponseImageEntity[]> {
    const finding = inquiryResponseImgCookies.map((inquiryResponseImgCookie) => {
      return this.mediaSearchRepository.findInquiryResponseImageWithId(inquiryResponseImgCookie.id);
    });

    return Promise.all(finding);
  }

  public findInquiryResponseVideosWithId(
    inquiryResponseVdoCookies: MediaCookieDto[],
  ): Promise<InquiryResponseImageEntity[]> {
    const finding = inquiryResponseVdoCookies.map((inquiryResponseVdoCookie) => {
      return this.mediaSearchRepository.findInquiryResponseVideoWithId(inquiryResponseVdoCookie.id);
    });

    return Promise.all(finding);
  }
}
