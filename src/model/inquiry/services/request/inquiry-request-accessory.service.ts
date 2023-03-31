import { Injectable } from "@nestjs/common";
import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { InquiryRequestImageEntity } from "src/model/media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "src/model/media/entities/inquiry-request-video.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { InquiryRequestDto } from "../../dto/request/inquiry-request.dto";
import { PushInquiryRequestImageDto } from "../../dto/request/push-inquiry-request-image.dto";
import { PushInquiryRequestVideoDto } from "../../dto/request/push-inquiry-request-video.dto";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

@Injectable()
export class InquiryRequestAccessoryService {
  constructor(
    private readonly mediaInsertRepository: MediaInsertRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
  ) {}

  async pushMoreThenTwoInquiryImageInDto(
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

  async pushOneInquiryImageInDto(
    inquiryRequestImgCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const image =
      await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
        inquiryRequestImgCookies[0].url,
      );

    inquiryRequestDto.Image.push(image);
  }

  async pushMoreThenTwoInquiryVideoInDto(
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

  async pushOneInquiryVideoInDto(
    inquiryRequestVdoCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const video =
      await this.mediaGeneralRepository.findInquiryReuqestVideoWithUrl(
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

  async distinguishInquiryImagesCountForPush(
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

  async distinguishInquiryVideosCountForPush(
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

  async distinguishInquiryImagesCountForInsert(
    inquiryRequestImgCookies: RequestMediaDto[],
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

  async distinguishInquiryVideosCountForInsert(
    inquiryRequestVdoCookies: RequestMediaDto[],
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
}
