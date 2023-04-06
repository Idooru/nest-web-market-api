import { Injectable } from "@nestjs/common";
import { PushInquiryMediaDto } from "../../dto/response/push-inquiry-response-media.dto";
import { InquiryResponseAccessoryService } from "./inquiry-response-accessory.service";
import { InsertInquiryResponseMediaDto } from "../../dto/response/insert-inquiry-response-media.dto";
import { UserEntity } from "src/model/user/entities/user.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";

@Injectable()
export class InquiryResponseBundleService {
  constructor(
    private readonly inquiryResponseAccessoryService: InquiryResponseAccessoryService,
  ) {}

  async pushInquiryMedia(
    pushInquiryMediaDto: PushInquiryMediaDto,
  ): Promise<void> {
    const {
      inquiryResponseDto,
      inquiryResponseImgCookies,
      inquiryResponseVdoCookies,
    } = pushInquiryMediaDto;

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
    insertInquiryMediaDto: InsertInquiryResponseMediaDto,
  ): Promise<void> {
    const {
      inquiryResponseImgCookies,
      inquiryResponseVdoCookies,
      inquiryResponse,
      inquiryResponseDto,
    } = insertInquiryMediaDto;

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

  async findStuffForEmail(
    userId: string,
    inquiryRequestId: string,
  ): Promise<[UserEntity, InquiryRequestEntity, InquiryResponseEntity]> {
    return await this.inquiryResponseAccessoryService.findStuffForEmail(
      userId,
      inquiryRequestId,
    );
  }
}
