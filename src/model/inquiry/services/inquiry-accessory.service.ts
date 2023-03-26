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

  async pushOneInquiryRequestImageInDto(
    inquiryRequestImgCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const image =
      await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
        inquiryRequestImgCookies[0].url,
      );
    inquiryRequestDto.Image.push(image);
  }

  async pushMoreThenTwoInquiryRequestVideoInDto(
    inquiryRequestVdoCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const promises = inquiryRequestVdoCookies.map(
      async (inquiryRequestVdoCookie) => {
        const video =
          await this.mediaGeneralRepository.findInquiryReuqestVideoWithUrl(
            inquiryRequestVdoCookie.url,
          );

        inquiryRequestDto.Video.push(video);
      },
    );

    await Promise.all(promises);
  }

  async pushOneInquiryRequestVideoInDto(
    inquiryRequestVdoCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const video =
      await this.mediaGeneralRepository.findInquiryReuqestVideoWithUrl(
        inquiryRequestVdoCookies[0].url,
      );

    inquiryRequestDto.Video.push(video);
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
    const { inquiryRequestImgCookies, inquiryRequestDto } =
      pushInquiryRequestImageDto;

    inquiryRequestDto.Image = [];

    if (inquiryRequestImgCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryRequestImageInDto(
        inquiryRequestImgCookies,
        inquiryRequestDto,
      );
    } else {
      await this.pushOneInquiryRequestImageInDto(
        inquiryRequestImgCookies,
        inquiryRequestDto,
      );
    }
  }

  async distinguishInquiryRequestVideosCountForPush(
    pushInquiryRequestVideoDto: PushInquiryRequestVideoDto,
  ): Promise<void> {
    const { inquiryRequestVdoCookies, inquiryRequestDto } =
      pushInquiryRequestVideoDto;

    inquiryRequestDto.Video = [];

    if (inquiryRequestVdoCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryRequestVideoInDto(
        inquiryRequestVdoCookies,
        inquiryRequestDto,
      );
    } else {
      await this.pushOneInquiryRequestVideoInDto(
        inquiryRequestVdoCookies,
        inquiryRequestDto,
      );
    }
  }

  async distinguishInquiryRequestImagesCountForInsert(
    inquiryRequestImgCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    if (inquiryRequestImgCookies.length >= 2) {
      await this.insertInquiryRequestIdOneMoreThenTwoInquiryRequestImage(
        inquiryRequestDto.Image,
        inquiryRequest,
      );
    } else {
      await this.insertInquiryRequestIdOnOneInquiryRequestImage(
        inquiryRequestDto.Image[0],
        inquiryRequest,
      );
    }
  }

  async distinguishInquiryRequestVideosCountForInsert(
    inquiryRequestVdoCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void> {
    if (inquiryRequestVdoCookies.length >= 2) {
      await this.insertInquiryRequestIdOneMoreThenTwoInquiryVideo(
        inquiryRequestDto.Video,
        inquiryRequest,
      );
    } else {
      await this.insertInquiryRequestIdOnOneInquiryRequestImage(
        inquiryRequestDto.Image[0],
        inquiryRequest,
      );
    }
  }
}
