import { HttpStatus, Injectable } from "@nestjs/common";
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
import { IMediaAccessoryService } from "../interfaces/services/media-accessory-service.interface";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";

@Injectable()
export class MediaAccessoryService
  extends ErrorHandlerProps
  implements IMediaAccessoryService
{
  constructor(
    private readonly configService: ConfigService,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  isExistMediaFiles(mediaType: string, files: Express.Multer.File[]): void {
    if (files.length === 0) {
      this.methodName = this.isExistMediaFiles.name;
      this.httpExceptionHandlingBuilder
        .setMessage(
          `${mediaType}을(를) 업로드 할 수 없습니다. 파일을 제시해주세요.`,
        )
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
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
    url: string,
  ): MediaDto {
    return {
      whatCookie: cookieKey,
      url,
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

  deleteMediaFilesOnServerDisk(mediaFileName: string, mediaPath: string): void {
    fs.rmSync(
      path.join(__dirname, `../../../../uploads/${mediaPath}/${mediaFileName}`),
    );
  }

  async findProductImages(productImgCookies: MediaDto[]) {
    if (productImgCookies.length >= 2) {
      const promises = productImgCookies.map(async (productImgCookie) => {
        return await this.mediaGeneralRepository.findProductImageWithUrl(
          productImgCookie.url,
        );
      });

      return await Promise.all(promises);
    } else {
      return [
        await this.mediaGeneralRepository.findProductImageWithUrl(
          productImgCookies[0].url,
        ),
      ];
    }
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
