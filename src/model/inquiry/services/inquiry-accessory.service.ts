import { Injectable } from "@nestjs/common";
import { PushInquiryRequestImageDto } from "src/model/inquiry/dto/request/push-inquiry-request-image.dto";
import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { InquiryRequestImageEntity } from "src/model/media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "src/model/media/entities/inquiry-request-video.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { PushInquiryRequestVideoDto } from "../dto/request/push-inquiry-request-video.dto";
import { InquiryRequestDto } from "../dto/request/inquiry-request.dto";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";

@Injectable()
export class InquiryAccessoryService {
  constructor(
    private readonly mediaInsertRepository: MediaInsertRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
  ) {}

  async pushMoreThenTwoInquiryRequestImageInDto(
    inquiryRequestImgCookies: RequestMediaDto[],
    createInquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const promises = inquiryRequestImgCookies.map(
      async (inquiryRequestImgCookie) => {
        const image =
          await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
            inquiryRequestImgCookie.url,
          );

        createInquiryRequestDto.Image.push(image);
      },
    );

    await Promise.all(promises);
  }

  async pushOneInquiryRequestImageInDto(
    inquiryRequestImgCookies: RequestMediaDto[],
    createInquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const image =
      await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
        inquiryRequestImgCookies[0].url,
      );
    createInquiryRequestDto.Image.push(image);
  }

  async pushMoreThenTwoInquiryRequestVideoInDto(
    inquiryRequestVdoCookies: RequestMediaDto[],
    createInquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const promises = inquiryRequestVdoCookies.map(
      async (inquiryRequestVdoCookie) => {
        const video =
          await this.mediaGeneralRepository.findInquiryReuqestVideoWithUrl(
            inquiryRequestVdoCookie.url,
          );

        createInquiryRequestDto.Video.push(video);
      },
    );

    await Promise.all(promises);
  }

  async pushOneInquiryRequestVideoInDto(
    inquiryRequestVdoCookies: RequestMediaDto[],
    createInquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const video =
      await this.mediaGeneralRepository.findInquiryReuqestVideoWithUrl(
        inquiryRequestVdoCookies[0].url,
      );

    createInquiryRequestDto.Video.push(video);
  }

  async insertInquiryRequestIdOneMoreThenTwoInquiryRequestImage(
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

  async insertInquiryRequestIdOnOneInquiryRequestImage(
    inquiryRequestImage: InquiryRequestImageEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertInquiryRequestIdOnInquiryRequestImage(
      inquiryRequestImage,
      inquiryRequest,
    );
  }

  async insertInquiryRequestIdOneMoreThenTwoInquiryVideo(
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

  async insertInquiryRequestIdOneOneInquiryRequestVideo(
    inquiryRequestVideo: InquiryRequestVideoEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertInquiryRequestIdOnInquiryRequestVideo(
      inquiryRequestVideo,
      inquiryRequest,
    );
  }

  async distinguishInquiryRequestImagesCountForPush(
    pushInquiryRequestImageDto: PushInquiryRequestImageDto,
  ): Promise<void> {
    const { inquiryRequestImgCookies, createInquiryRequestDto } =
      pushInquiryRequestImageDto;

    createInquiryRequestDto.Image = [];

    if (inquiryRequestImgCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryRequestImageInDto(
        inquiryRequestImgCookies,
        createInquiryRequestDto,
      );
    } else {
      await this.pushOneInquiryRequestImageInDto(
        inquiryRequestImgCookies,
        createInquiryRequestDto,
      );
    }
  }

  async distinguishInquiryRequestVideosCountForPush(
    pushInquiryRequestVideoDto: PushInquiryRequestVideoDto,
  ): Promise<void> {
    const { inquiryRequestVdoCookies, createInquiryRequestDto } =
      pushInquiryRequestVideoDto;

    createInquiryRequestDto.Video = [];

    if (inquiryRequestVdoCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryRequestVideoInDto(
        inquiryRequestVdoCookies,
        createInquiryRequestDto,
      );
    } else {
      await this.pushOneInquiryRequestVideoInDto(
        inquiryRequestVdoCookies,
        createInquiryRequestDto,
      );
    }
  }

  async distinguishInquiryRequestImagesCountForInsert(
    inquiryRequestImgCookies: RequestMediaDto[],
    createInquiryRequestDto: InquiryRequestDto,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    if (inquiryRequestImgCookies.length >= 2) {
      await this.insertInquiryRequestIdOneMoreThenTwoInquiryRequestImage(
        createInquiryRequestDto.Image,
        inquiryRequest,
      );
    } else {
      await this.insertInquiryRequestIdOnOneInquiryRequestImage(
        createInquiryRequestDto.Image[0],
        inquiryRequest,
      );
    }
  }

  async distinguishInquiryRequestVideosCountForInsert(
    inquiryRequestVdoCookies: RequestMediaDto[],
    createInquiryRequestDto: InquiryRequestDto,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    if (inquiryRequestVdoCookies.length >= 2) {
      await this.insertInquiryRequestIdOneMoreThenTwoInquiryVideo(
        createInquiryRequestDto.Video,
        inquiryRequest,
      );
    } else {
      await this.insertInquiryRequestIdOnOneInquiryRequestImage(
        createInquiryRequestDto.Image[0],
        inquiryRequest,
      );
    }
  }
}
