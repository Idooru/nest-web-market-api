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

  async findProductImagesWithId(
    productImgCookies: MediaCookieDto[],
  ): Promise<ProductImageEntity[]> {
    const finding = productImgCookies.map(async (productImgCookie) => {
      return await this.mediaSearchRepository.findProductImageWithId(
        productImgCookie.id,
      );
    });

    return await Promise.all(finding);
  }

  async findBeforeProductImagesWithId(
    id: string,
  ): Promise<ProductImageEntity[]> {
    return await this.mediaSearchRepository.findBeforeProductImagesWithId(id);
  }

  async findReviewImagesWithId(
    reviewImgCookies: MediaCookieDto[],
  ): Promise<ReviewImageEntity[]> {
    const finding = reviewImgCookies.map(async (reviewImgCookie) => {
      return await this.mediaSearchRepository.findReviewImageWithId(
        reviewImgCookie.id,
      );
    });

    return await Promise.all(finding);
  }

  async findBeforeReviewImagesWithId(id: string): Promise<ReviewImageEntity[]> {
    return await this.mediaSearchRepository.findBeforeReviewImagesWithId(id);
  }

  async findReviewVideosWithId(
    reviewVdoCookies: MediaCookieDto[],
  ): Promise<ReviewVideoEntity[]> {
    const finding = reviewVdoCookies.map(async (reviewVdoCookie) => {
      return await this.mediaSearchRepository.findReviewVideoWithId(
        reviewVdoCookie.id,
      );
    });

    return await Promise.all(finding);
  }

  async findBeforeReviewVideosWithId(id: string): Promise<ReviewVideoEntity[]> {
    return await this.mediaSearchRepository.findBeforeReviewVideosWithId(id);
  }

  async findInquiryRequestImagesWithId(
    inquiryRequestImgCookies: MediaCookieDto[],
  ): Promise<InquiryRequestImageEntity[]> {
    const finding = inquiryRequestImgCookies.map(
      async (inquiryRequestImgCookie) => {
        return await this.mediaSearchRepository.findInquiryRequestImageWithId(
          inquiryRequestImgCookie.id,
        );
      },
    );

    return await Promise.all(finding);
  }

  async findInquiryRequestVideosWithId(
    inquiryRequestVdoCookies: MediaCookieDto[],
  ): Promise<InquiryRequestVideoEntity[]> {
    const finding = inquiryRequestVdoCookies.map(
      async (inquiryRequestVdoCookie) => {
        return await this.mediaSearchRepository.findInquiryRequestVideoWithId(
          inquiryRequestVdoCookie.id,
        );
      },
    );

    return await Promise.all(finding);
  }

  async findInquiryResponseImagesWithId(
    inquiryResponseImgCookies: MediaCookieDto[],
  ): Promise<InquiryResponseImageEntity[]> {
    const finding = inquiryResponseImgCookies.map(
      async (inquiryResponseImgCookie) => {
        return await this.mediaSearchRepository.findInquiryResponseImageWithId(
          inquiryResponseImgCookie.id,
        );
      },
    );

    return await Promise.all(finding);
  }

  async findInquiryResponseVideosWithId(
    inquiryResponseVdoCookies: MediaCookieDto[],
  ): Promise<InquiryResponseImageEntity[]> {
    const finding = inquiryResponseVdoCookies.map(
      async (inquiryResponseVdoCookie) => {
        return await this.mediaSearchRepository.findInquiryResponseVideoWithId(
          inquiryResponseVdoCookie.id,
        );
      },
    );

    return await Promise.all(finding);
  }
}
