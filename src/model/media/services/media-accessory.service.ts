import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import { MediaDto } from "../dto/media.dto";
import { MediaGeneralRepository } from "../repositories/media-general.repository";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";
import { ReviewImageEntity } from "../entities/review-image.entity";
import { ReviewVideoEntity } from "../entities/review-video.entity";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";

@Injectable()
export class MediaAccessoryService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
  ) {}

  isExistMediaFile(
    mediaType: string,
    file: Express.Multer.File | Express.Multer.File[],
  ) {
    if (!file) {
      throw new BadRequestException(
        `${mediaType}을(를) 업로드 할 수 없습니다. 파일을 제시해주세요.`,
      );
    }
  }

  setUrl(mediaFileName: string, path: string): string {
    return `${this.configService.get(
      "APPLICATION_SCHEME",
    )}://${this.configService.get("APPLICATION_HOST")}:${this.configService.get(
      "APPLICATION_PORT",
    )}/media/${path}/${mediaFileName}`.toLowerCase();
  }

  createMediaCookieValue(
    cookieKey: string,
    file: Express.Multer.File,
  ): MediaDto {
    return {
      whatCookie: cookieKey,
      url: this.setUrl(file.filename),
      fileName: file.filename,
    };
  }

  createMediaCookieValues(
    cookieKey: string,
    files: Express.Multer.File[],
    urls: string[],
  ): MediaDto[] {
    return files.map((file, idx) => ({
      whatCookie: cookieKey,
      url: urls[idx],
      fileName: file.filename,
    }));
  }

  deleteMediaFilesOnServerDisk(mediaFileName: string, mediaPath: string) {
    fs.rmSync(
      path.join(__dirname, `../../../../uploads/${mediaPath}/${mediaFileName}`),
    );
  }

  async findReviewImages(
    reviewImgCookies: MediaDto[],
  ): Promise<ReviewImageEntity[]> {
    if (reviewImgCookies.length >= 2) {
      const promises = reviewImgCookies.map(async (reviewImgCookie) => {
        return await this.mediaGeneralRepository.findReviewImageWithUrl(
          reviewImgCookie.url,
        );
      });

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findReviewImageWithUrl(
          reviewImgCookies[0].url,
        ),
      ];
    }
  }

  async findReviewVideos(
    reviewVdoCookies: MediaDto[],
  ): Promise<ReviewVideoEntity[]> {
    if (reviewVdoCookies.length >= 2) {
      const promises = reviewVdoCookies.map(async (reviewVdoCookie) => {
        return await this.mediaGeneralRepository.findReviewVideoWithUrl(
          reviewVdoCookie.url,
        );
      });

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findReviewVideoWithUrl(
          reviewVdoCookies[0].url,
        ),
      ];
    }
  }

  async findInquiryRequestImages(
    inquiryRequestImgCookies: MediaDto[],
  ): Promise<InquiryRequestImageEntity[]> {
    if (inquiryRequestImgCookies.length >= 2) {
      const promises = inquiryRequestImgCookies.map(
        async (inquiryRequestImgCookie) => {
          return await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
            inquiryRequestImgCookie.url,
          );
        },
      );

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findInquiryRequestImageWithUrl(
          inquiryRequestImgCookies[0].url,
        ),
      ];
    }
  }

  async findInquiryRequestVideos(
    inquiryRequestVdoCookies: MediaDto[],
  ): Promise<InquiryRequestVideoEntity[]> {
    if (inquiryRequestVdoCookies.length >= 2) {
      const promises = inquiryRequestVdoCookies.map(
        async (inquiryReqeustImage) => {
          return await this.mediaGeneralRepository.findInquiryRequestVideoWithUrl(
            inquiryReqeustImage.url,
          );
        },
      );

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findInquiryRequestVideoWithUrl(
          inquiryRequestVdoCookies[0].url,
        ),
      ];
    }
  }

  async findInquiryResponseImages(
    inquiryResponseImgCookies: MediaDto[],
  ): Promise<InquiryResponseImageEntity[]> {
    if (inquiryResponseImgCookies.length >= 2) {
      const promises = inquiryResponseImgCookies.map(
        async (inquiryResponseImgCookie) => {
          return await this.mediaGeneralRepository.findInquiryResponseImageWithUrl(
            inquiryResponseImgCookie.url,
          );
        },
      );

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findInquiryResponseImageWithUrl(
          inquiryResponseImgCookies[0].url,
        ),
      ];
    }
  }

  async findInquiryResponseVideos(
    inquiryResponseVdoCookies: MediaDto[],
  ): Promise<InquiryResponseVideoEntity[]> {
    if (inquiryResponseVdoCookies.length >= 2) {
      const promises = inquiryResponseVdoCookies.map(
        async (inquiryResponseVdoCookie) => {
          return await this.mediaGeneralRepository.findInquiryResponseVideoWithUrl(
            inquiryResponseVdoCookie.url,
          );
        },
      );

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findInquiryResponseVideoWithUrl(
          inquiryResponseVdoCookies[0].url,
        ),
      ];
    }
  }
}
