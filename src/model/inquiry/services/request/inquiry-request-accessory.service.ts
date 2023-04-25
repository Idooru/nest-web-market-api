import { Injectable } from "@nestjs/common";
import { InquiryRequestImageEntity } from "src/model/media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "src/model/media/entities/inquiry-request-video.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { InquiryRequestDto } from "../../dto/request/inquiry-request.dto";
import { PushInquiryRequestImageDto } from "../../dto/request/push-inquiry-request-image.dto";
import { PushInquiryRequestVideoDto } from "../../dto/request/push-inquiry-request-video.dto";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { MediaDto } from "src/model/media/dto/media.dto";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { InquiryInsertRepository } from "../../repositories/inquiry-insert.repository";
import { ProductEntity } from "src/model/product/entities/product.entity";

@Injectable()
export class InquiryRequestAccessoryService {
  constructor(
    private readonly mediaInsertRepository: MediaInsertRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly inquiryInsertRepository: InquiryInsertRepository,
  ) {}

  async pushMoreThenTwoInquiryImageInDto(
    inquiryRequestImgCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const promises = inquiryRequestImgCookies.map(
      async (inquiryRequestImgCookie) => {
        const image =
          await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
            inquiryRequestImgCookie.url,
          );

        inquiryRequestDto.Image.push(image);
      },
    );

    await Promise.all(promises);
  }

  async pushOneInquiryImageInDto(
    inquiryRequestImgCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const image =
      await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
        inquiryRequestImgCookies[0].url,
      );

    inquiryRequestDto.Image.push(image);
  }

  async pushMoreThenTwoInquiryVideoInDto(
    inquiryRequestVdoCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const promises = inquiryRequestVdoCookies.map(
      async (inquiryRequestVdoCookie) => {
        const video =
          await this.mediaGeneralRepository.findInquiryRequestVideoWithUrl(
            inquiryRequestVdoCookie.url,
          );

        inquiryRequestDto.Video.push(video);
      },
    );

    await Promise.all(promises);
  }

  async pushOneInquiryVideoInDto(
    inquiryRequestVdoCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const video =
      await this.mediaGeneralRepository.findInquiryRequestVideoWithUrl(
        inquiryRequestVdoCookies[0].url,
      );

    inquiryRequestDto.Video.push(video);
  }

  async insertInquiryIdOneMoreThenTwoInquiryImage(
    inquiryRequestImages: InquiryRequestImageEntity[],
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    const promises = inquiryRequestImages.map(async (inquiryRequestImage) => {
      await this.mediaInsertRepository.insertInquiryRequestIdOnInquiryRequestImage(
        inquiryRequestImage,
        inquiryRequest,
      );
    });

    await Promise.all(promises);
  }

  async insertInquiryIdOnOneInquiryImage(
    inquiryRequestImage: InquiryRequestImageEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertInquiryRequestIdOnInquiryRequestImage(
      inquiryRequestImage,
      inquiryRequest,
    );
  }

  async insertInquiryIdOneMoreThenTwoInquiryVideo(
    inquiryRequestVideos: InquiryRequestVideoEntity[],
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    const promises = inquiryRequestVideos.map(async (inquiryRequestVideo) => {
      await this.mediaInsertRepository.insertInquiryRequestIdOnInquiryRequestVideo(
        inquiryRequestVideo,
        inquiryRequest,
      );
    });

    await Promise.all(promises);
  }

  async insertInquiryIdOnOneInquiryVideo(
    inquiryRequestVideo: InquiryRequestVideoEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertInquiryRequestIdOnInquiryRequestVideo(
      inquiryRequestVideo,
      inquiryRequest,
    );
  }

  async pushInquiryImages(
    pushInquiryRequestImageDto: PushInquiryRequestImageDto,
  ): Promise<void> {
    const { inquiryRequestImgCookies, inquiryRequestDto } =
      pushInquiryRequestImageDto;

    inquiryRequestDto.Image = [];

    if (inquiryRequestImgCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryImageInDto(
        inquiryRequestImgCookies,
        inquiryRequestDto,
      );
    } else {
      await this.pushOneInquiryImageInDto(
        inquiryRequestImgCookies,
        inquiryRequestDto,
      );
    }
  }

  async pushInquiryVideos(
    pushInquiryRequestVideoDto: PushInquiryRequestVideoDto,
  ): Promise<void> {
    const { inquiryRequestVdoCookies, inquiryRequestDto } =
      pushInquiryRequestVideoDto;

    inquiryRequestDto.Video = [];

    if (inquiryRequestVdoCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryVideoInDto(
        inquiryRequestVdoCookies,
        inquiryRequestDto,
      );
    } else {
      await this.pushOneInquiryVideoInDto(
        inquiryRequestVdoCookies,
        inquiryRequestDto,
      );
    }
  }

  async insertInquiryImages(
    inquiryRequestImgCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    if (inquiryRequestImgCookies.length >= 2) {
      await this.insertInquiryIdOneMoreThenTwoInquiryImage(
        inquiryRequestDto.Image,
        inquiryRequest,
      );
    } else {
      await this.insertInquiryIdOnOneInquiryImage(
        inquiryRequestDto.Image[0],
        inquiryRequest,
      );
    }
  }

  async insertInquiryVideos(
    inquiryRequestVdoCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    if (inquiryRequestVdoCookies.length >= 2) {
      await this.insertInquiryIdOneMoreThenTwoInquiryVideo(
        inquiryRequestDto.Video,
        inquiryRequest,
      );
    } else {
      await this.insertInquiryIdOnOneInquiryVideo(
        inquiryRequestDto.Video[0],
        inquiryRequest,
      );
    }
  }

  async findStuffForEmail(
    productId: string,
    inquiryRequestId: string,
  ): Promise<[ProductEntity, InquiryRequestEntity]> {
    return await Promise.all([
      this.productGeneralRepository.findOneProductById(productId),
      this.inquiryInsertRepository.findOneInquiryRequestById(inquiryRequestId),
    ]);
  }
}
