import { Injectable } from "@nestjs/common";
import { InquiryResponseImageEntity } from "src/model/media/entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "src/model/media/entities/inquiry-response-video.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { InquiryResponseDto } from "../../dto/response/inquiry-response.dto";
import { PushInquiryResponseImageDto } from "../../dto/response/push-inquiry-reponse-image.dto";
import { PushInquiryResponseVideoDto } from "../../dto/response/push-inquiry-response-video.dto";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { MediaDto } from "src/model/media/dto/media.dto";

@Injectable()
export class InquiryResponseAccessoryService {
  constructor(
    private readonly mediaInsertRepository: MediaInsertRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
  ) {}

  async pushMoreThenTwoInquiryImageInDto(
    inquiryResponseImgCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<void> {
    const promises = inquiryResponseImgCookies.map(
      async (inquiryResponseImgCookie) => {
        const image =
          await this.mediaGeneralRepository.findInquiryResponseImageWithUrl(
            inquiryResponseImgCookie.url,
          );

        inquiryResponseDto.Image.push(image);
      },
    );

    await Promise.all(promises);
  }

  async pushOneInquiryImageInDto(
    inquiryResponseImgCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<void> {
    const image =
      await this.mediaGeneralRepository.findInquiryResponseImageWithUrl(
        inquiryResponseImgCookies[0].url,
      );

    inquiryResponseDto.Image.push(image);
  }

  async pushMoreThenTwoInquiryVideoInDto(
    inquiryResponseVdoCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<void> {
    const promises = inquiryResponseVdoCookies.map(
      async (inquiryResponseVdoCookie) => {
        const video =
          await this.mediaGeneralRepository.findInquiryResponseVideoWithUrl(
            inquiryResponseVdoCookie.url,
          );

        inquiryResponseDto.Video.push(video);
      },
    );

    await Promise.all(promises);
  }

  async pushOneInquiryVideoInDto(
    inquiryResponseVdoCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<void> {
    const video =
      await this.mediaGeneralRepository.findInquiryResponseVideoWithUrl(
        inquiryResponseVdoCookies[0].url,
      );

    inquiryResponseDto.Video.push(video);
  }

  async insertInquiryIdOneMoreThenTwoInquiryImage(
    inquiryResponseImages: InquiryResponseImageEntity[],
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    const promises = inquiryResponseImages.map(async (inquiryResponseImage) => {
      await this.mediaInsertRepository.insertInquiryResponseIdOnInquiryResponseImage(
        inquiryResponseImage,
        inquiryResponse,
      );
    });

    await Promise.all(promises);
  }

  async insertInquiryIdOnOneInquiryImage(
    inquiryResponseImage: InquiryResponseImageEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertInquiryResponseIdOnInquiryResponseImage(
      inquiryResponseImage,
      inquiryResponse,
    );
  }

  async insertInquiryIdOneMoreThenTwoInquiryVideo(
    inquiryResponseVideos: InquiryResponseVideoEntity[],
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    const promises = inquiryResponseVideos.map(async (inquiryResponseVideo) => {
      await this.mediaInsertRepository.insertInquiryResponseIdOnInquiryResponseVideo(
        inquiryResponseVideo,
        inquiryResponse,
      );
    });

    await Promise.all(promises);
  }

  async insertInquiryIdOnOneInquiryVideo(
    inquiryResponseVideo: InquiryResponseVideoEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertInquiryResponseIdOnInquiryResponseVideo(
      inquiryResponseVideo,
      inquiryResponse,
    );
  }

  async distinguishInquiryImagesCountForPush(
    pushInquiryResponseImageDto: PushInquiryResponseImageDto,
  ): Promise<void> {
    const { inquiryResponseImgCookies, inquiryResponseDto } =
      pushInquiryResponseImageDto;

    inquiryResponseDto.Image = [];

    if (inquiryResponseImgCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryImageInDto(
        inquiryResponseImgCookies,
        inquiryResponseDto,
      );
    } else {
      await this.pushOneInquiryImageInDto(
        inquiryResponseImgCookies,
        inquiryResponseDto,
      );
    }
  }

  async distinguishInquiryVideosCountForPush(
    pushInquiryResponseVideoDto: PushInquiryResponseVideoDto,
  ): Promise<void> {
    const { inquiryResponseVdoCookies, inquiryResponseDto } =
      pushInquiryResponseVideoDto;

    inquiryResponseDto.Video = [];

    if (inquiryResponseVdoCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryVideoInDto(
        inquiryResponseVdoCookies,
        inquiryResponseDto,
      );
    } else {
      await this.pushOneInquiryVideoInDto(
        inquiryResponseVdoCookies,
        inquiryResponseDto,
      );
    }
  }

  async distinguishInquiryImagesCountForInsert(
    inquiryResponseImgCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    if (inquiryResponseImgCookies.length >= 2) {
      await this.insertInquiryIdOneMoreThenTwoInquiryImage(
        inquiryResponseDto.Image,
        inquiryResponse,
      );
    } else {
      await this.insertInquiryIdOnOneInquiryImage(
        inquiryResponseDto.Image[0],
        inquiryResponse,
      );
    }
  }

  async distinguishInquiryVideosCountForInsert(
    inquiryResponseVdoCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void> {
    if (inquiryResponseVdoCookies.length >= 2) {
      await this.insertInquiryIdOneMoreThenTwoInquiryVideo(
        inquiryResponseDto.Video,
        inquiryResponse,
      );
    } else {
      await this.insertInquiryIdOnOneInquiryVideo(
        inquiryResponseDto.Video[0],
        inquiryResponse,
      );
    }
  }
}
