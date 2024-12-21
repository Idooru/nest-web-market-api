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

  public findProductImagesWithId(productImgCookies: MediaCookieDto[]): Promise<ProductImageEntity[]> {
    const finding = productImgCookies.map((productImgCookie) => {
      return this.mediaSearchRepository.findProductImageWithId(productImgCookie.id);
    });

    return Promise.all(finding);
  }

  public findBeforeProductImagesWithId(id: string): Promise<ProductImageEntity[]> {
    return this.mediaSearchRepository.findBeforeProductImagesWithId(id);
  }

  findReviewImagesWithId(reviewImgCookies: MediaCookieDto[]): Promise<ReviewImageEntity[]> {
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

  public findInquiryRequestImagesWithId(
    inquiryRequestImgCookies: MediaCookieDto[],
  ): Promise<InquiryRequestImageEntity[]> {
    const finding = inquiryRequestImgCookies.map((inquiryRequestImgCookie) => {
      return this.mediaSearchRepository.findInquiryRequestImageWithId(inquiryRequestImgCookie.id);
    });

    return Promise.all(finding);
  }

  public findInquiryRequestVideosWithId(
    inquiryRequestVdoCookies: MediaCookieDto[],
  ): Promise<InquiryRequestVideoEntity[]> {
    const finding = inquiryRequestVdoCookies.map((inquiryRequestVdoCookie) => {
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
