import { Injectable } from "@nestjs/common";
import { InsertInquiryRequestMediaDto } from "../dto/request/insert-inquiry-request-media.dto";
import { PushInquiryRequestMediaDto } from "../dto/request/push-inquiry-request-media.dto";
import { InquiryAccessoryService } from "./inquiry-accessory.service";

@Injectable()
export class InquiryBundleService {
  constructor(
    private readonly inquiryAccessoryService: InquiryAccessoryService,
  ) {}

  async pushInquiryRequestMedia(
    pushInquiryRequestMediaDto: PushInquiryRequestMediaDto,
  ): Promise<void> {
    const {
      inquiryRequestDto,
      inquiryRequestImgCookies,
      inquiryRequestVdoCookies,
    } = pushInquiryRequestMediaDto;

    if (inquiryRequestImgCookies) {
      await this.inquiryAccessoryService.distinguishInquiryRequestImagesCountForPush(
        {
          inquiryRequestDto,
          inquiryRequestImgCookies,
        },
      );
    }

    if (inquiryRequestVdoCookies) {
      await this.inquiryAccessoryService.distinguishInquiryRequestVideosCountForPush(
        {
          inquiryRequestDto,
          inquiryRequestVdoCookies,
        },
      );
    }
  }

  async insertInquiryRequestMedia(
    insertInquiryRequestMediaDto: InsertInquiryRequestMediaDto,
  ): Promise<void> {
    const {
      inquiryRequestImgCookies,
      inquiryRequestVdoCookies,
      inquiryRequest,
      inquiryRequestDto,
    } = insertInquiryRequestMediaDto;

    if (inquiryRequestImgCookies) {
      await this.inquiryAccessoryService.distinguishInquiryRequestImagesCountForInsert(
        inquiryRequestImgCookies,
        inquiryRequestDto,
        inquiryRequest,
      );
    }

    if (inquiryRequestVdoCookies) {
      await this.inquiryAccessoryService.distinguishInquiryRequestVideosCountForInsert(
        inquiryRequestVdoCookies,
        inquiryRequestDto,
        inquiryRequest,
      );
    }
  }
}