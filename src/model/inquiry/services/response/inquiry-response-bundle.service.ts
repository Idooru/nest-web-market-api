import { Injectable } from "@nestjs/common";
import { InsertInquiryResponseMediaDto } from "../../dto/response/insert-inquiry-response-media.dto";
import { PushInquiryResponseMediaDto } from "../../dto/response/push-inquiry-response-media.dto";
import { InquiryResponseAccessoryService } from "./inquiry-response-accessory.service";

@Injectable()
export class InquiryResponseBundleService {
  constructor(
    private readonly inquiryResponseAccessoryService: InquiryResponseAccessoryService,
  ) {}

  async pushInquiryMedia(
    pushInquiryResponseMediaDto: PushInquiryResponseMediaDto,
  ): Promise<void> {
    const {
      inquiryResponseDto,
      inquiryResponseImgCookies,
      inquiryResponseVdoCookies,
    } = pushInquiryResponseMediaDto;

    if (inquiryResponseImgCookies) {
      await this.inquiryResponseAccessoryService.distinguishInquiryImagesCountForPush(
        {
          inquiryResponseDto,
          inquiryResponseImgCookies,
        },
      );
    }

    if (inquiryResponseVdoCookies) {
      await this.inquiryResponseAccessoryService.distinguishInquiryVideosCountForPush(
        {
          inquiryResponseDto,
          inquiryResponseVdoCookies,
        },
      );
    }
  }

  async insertInquiryMedia(
    insertInquiryResponseMediaDto: InsertInquiryResponseMediaDto,
  ): Promise<void> {
    const {
      inquiryResponseImgCookies,
      inquiryResponseVdoCookies,
      inquiryResponse,
      inquiryResponseDto,
    } = insertInquiryResponseMediaDto;

    if (inquiryResponseImgCookies) {
      await this.inquiryResponseAccessoryService.distinguishInquiryImagesCountForInsert(
        inquiryResponseImgCookies,
        inquiryResponseDto,
        inquiryResponse,
      );
    }

    if (inquiryResponseVdoCookies) {
      await this.inquiryResponseAccessoryService.distinguishInquiryVideosCountForInsert(
        inquiryResponseVdoCookies,
        inquiryResponseDto,
        inquiryResponse,
      );
    }
  }
}
