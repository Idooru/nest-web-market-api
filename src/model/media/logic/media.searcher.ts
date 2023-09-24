import { Injectable } from "@nestjs/common";
import { ProductImageEntity } from "../entities/product-image.entity";
import { MediaCookieDto } from "../dto/media-cookie.dto";
import { MediaSearchRepository } from "../repositories/media-search.repository";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";

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

  async findBeforeProductImageWithId(
    id: string,
  ): Promise<ProductImageEntity[]> {
    return await this.mediaSearchRepository.findBeforeProductImagesWithId(id);
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
