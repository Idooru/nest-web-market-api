import { Injectable } from "@nestjs/common";
import { InsertInquiryMediaDto } from "../dto/insert-inquiry-media.dto";
import { PushInquiryMediaDto } from "../dto/push-inquiry-media.dto";
import { InquiryAccessoryService } from "./inquiry-accessory.service";

@Injectable()
export class InquiryBundleService {
  constructor(
    private readonly inquiryAccessoryService: InquiryAccessoryService,
  ) {}

  async pushInquiryMedia(
    pushInquiryMediaDto: PushInquiryMediaDto,
  ): Promise<void> {
    const { inquiryRequestDto, inquiryImgCookies, inquiryVdoCookies } =
      pushInquiryMediaDto;

    if (inquiryImgCookies) {
      await this.inquiryAccessoryService.distinguishInquiryImagesCountForPush({
        inquiryRequestDto,
        inquiryImgCookies,
      });
    }

    if (inquiryVdoCookies) {
      await this.inquiryAccessoryService.distinguishInquiryVideosCountForPush({
        inquiryRequestDto,
        inquiryVdoCookies,
      });
    }
  }

  async insertInquiryMedia(
    insertInquiryMediaDto: InsertInquiryMediaDto,
  ): Promise<void> {
    const { inquiryImgCookies, inquiryVdoCookies, inquiry, inquiryRequestDto } =
      insertInquiryMediaDto;

    if (inquiryImgCookies) {
      await this.inquiryAccessoryService.distinguishInquiryImagesCountForInsert(
        inquiryImgCookies,
        inquiryRequestDto,
        inquiry,
      );
    }

    if (inquiryVdoCookies) {
      await this.inquiryAccessoryService.distinguishInquiryVideosCountForInsert(
        inquiryVdoCookies,
        inquiryRequestDto,
        inquiry,
      );
    }
  }
}
