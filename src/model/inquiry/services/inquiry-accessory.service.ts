import { Injectable } from "@nestjs/common";
import { PushInquiryImageDto } from "src/model/inquiry/dto/push-inquiry-image.dto";
import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { InquiryImageEntity } from "src/model/media/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "src/model/media/entities/inquiry.video.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { InquiryRequestDto } from "../dto/inquiry-request.dto";
import { PushInquiryVideoDto } from "../dto/push-inquiry-video.dto";
import { InquiryEntity } from "../entities/inquiry.entity";

@Injectable()
export class InquiryAccessoryService {
  constructor(
    private readonly mediaInsertRepository: MediaInsertRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
  ) {}

  async pushMoreThenTwoInquiryImageInDto(
    inquiryImgCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const promises = inquiryImgCookies.map(async (inquiryImgCookie) => {
      const image = await this.mediaGeneralRepository.findInquiryImageWithUrl(
        inquiryImgCookie.url,
      );

      inquiryRequestDto.Image.push(image);
    });

    await Promise.all(promises);
  }

  async pushOneInquiryImageInDto(
    inquiryImgCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ) {
    const image = await this.mediaGeneralRepository.findInquiryImageWithUrl(
      inquiryImgCookies[0].url,
    );
    inquiryRequestDto.Image.push(image);
  }

  async pushMoreThenTwoInquiryVideoInDto(
    inquiryVdoCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const promises = inquiryVdoCookies.map(async (inquiryVdoCookie) => {
      const video = await this.mediaGeneralRepository.findInquiryVideoWithUrl(
        inquiryVdoCookie.url,
      );

      inquiryRequestDto.Video.push(video);
    });

    await Promise.all(promises);
  }

  async pushOneInquiryVideoInDto(
    inquiryVdoCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void> {
    const video = await this.mediaGeneralRepository.findInquiryVideoWithUrl(
      inquiryVdoCookies[0].url,
    );

    inquiryRequestDto.Video.push(video);
  }

  async insertInquiryIdOneMoreThenTwoInquiryImage(
    inquiryImages: InquiryImageEntity[],
    inquiry: InquiryEntity,
  ): Promise<void> {
    const promises = inquiryImages.map(async (inquiryImage) => {
      await this.mediaInsertRepository.insertInquiryIdOnInquiryImage(
        inquiryImage,
        inquiry,
      );
    });

    await Promise.all(promises);
  }

  async insertInquiryIdOnOneInquiryImage(
    inquiryImage: InquiryImageEntity,
    inquiry: InquiryEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertInquiryIdOnInquiryImage(
      inquiryImage,
      inquiry,
    );
  }

  async insertInquiryIdOneMoreThenTwoInquiryVideo(
    inquiryVideos: InquiryVideoEntity[],
    inquiry: InquiryEntity,
  ): Promise<void> {
    const promises = inquiryVideos.map(async (inquiryVideo) => {
      await this.mediaInsertRepository.insertInquiryIdOnInquiryVideo(
        inquiryVideo,
        inquiry,
      );
    });

    await Promise.all(promises);
  }

  async insertInquiryIdOneOneInquiryVideo(
    inquiryVideo: InquiryVideoEntity,
    inquiry: InquiryEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertInquiryIdOnInquiryVideo(
      inquiryVideo,
      inquiry,
    );
  }

  async distinguishInquiryImagesCountForPush(
    pushInquiryImageDto: PushInquiryImageDto,
  ): Promise<void> {
    const { inquiryImgCookies, inquiryRequestDto } = pushInquiryImageDto;

    inquiryRequestDto.Image = [];

    if (inquiryImgCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryImageInDto(
        inquiryImgCookies,
        inquiryRequestDto,
      );
    } else {
      await this.pushOneInquiryImageInDto(inquiryImgCookies, inquiryRequestDto);
    }
  }

  async distinguishInquiryVideosCountForPush(
    pushInquiryVideoDto: PushInquiryVideoDto,
  ): Promise<void> {
    const { inquiryVdoCookies, inquiryRequestDto } = pushInquiryVideoDto;

    inquiryRequestDto.Video = [];

    if (inquiryVdoCookies.length >= 2) {
      await this.pushMoreThenTwoInquiryVideoInDto(
        inquiryVdoCookies,
        inquiryRequestDto,
      );
    } else {
      await this.pushOneInquiryVideoInDto(inquiryVdoCookies, inquiryRequestDto);
    }
  }

  async distinguishInquiryImagesCountForInsert(
    inquiryImgCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
    inquiry: InquiryEntity,
  ): Promise<void> {
    if (inquiryImgCookies.length >= 2) {
      await this.insertInquiryIdOneMoreThenTwoInquiryImage(
        inquiryRequestDto.Image,
        inquiry,
      );
    } else {
      await this.insertInquiryIdOnOneInquiryImage(
        inquiryRequestDto.Image[0],
        inquiry,
      );
    }
  }

  async distinguishInquiryVideosCountForInsert(
    inquiryVdoCookies: RequestMediaDto[],
    inquiryRequestDto: InquiryRequestDto,
    inquiry: InquiryEntity,
  ): Promise<void> {
    if (inquiryVdoCookies.length >= 2) {
      await this.insertInquiryIdOneMoreThenTwoInquiryVideo(
        inquiryRequestDto.Video,
        inquiry,
      );
    } else {
      await this.insertInquiryIdOnOneInquiryImage(
        inquiryRequestDto.Image[0],
        inquiry,
      );
    }
  }
}
