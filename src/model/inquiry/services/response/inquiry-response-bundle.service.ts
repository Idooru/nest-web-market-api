import { Injectable } from "@nestjs/common";
import { InquiryResponseAccessoryService } from "./inquiry-response-accessory.service";
import { InsertInquiryResponseMediaDto } from "../../dto/response/insert-inquiry-response-media.dto";
import { UserEntity } from "src/model/user/entities/user.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { IInquiryResponseBundleService } from "../../interfaces/services/response/inquiry-response-bundle-service.interface";
import { PushInquiryResponseMediaDto } from "../../dto/response/push-inquiry-response-media.dto";

@Injectable()
export class InquiryResponseBundleService
  implements IInquiryResponseBundleService
{
  constructor(
    private readonly inquiryResponseAccessoryService: InquiryResponseAccessoryService,
  ) {}

  async pushInquiryMedia(
    pushInquiryMediaDto: PushInquiryResponseMediaDto,
  ): Promise<void> {
    const {
      inquiryResponseDto,
      inquiryResponseImgCookies,
      inquiryResponseVdoCookies,
    } = pushInquiryMediaDto;

    if (inquiryResponseImgCookies) {
      await this.inquiryResponseAccessoryService.pushInquiryImages({
        inquiryResponseDto,
        inquiryResponseImgCookies,
      });
    }

    if (inquiryResponseVdoCookies) {
      await this.inquiryResponseAccessoryService.pushInquiryVideos({
        inquiryResponseDto,
        inquiryResponseVdoCookies,
      });
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
      await this.inquiryResponseAccessoryService.insertInquiryImages(
        inquiryResponseImgCookies,
        inquiryResponseDto,
        inquiryResponse,
      );
    }

    if (inquiryResponseVdoCookies) {
      await this.inquiryResponseAccessoryService.insertInquiryVideos(
        inquiryResponseVdoCookies,
        inquiryResponseDto,
        inquiryResponse,
      );
    }
  }

  async findStuffForEmail(
    userId: string,
    inquiryRequestId: string,
    inquiryResponseId: string,
  ): Promise<[UserEntity, InquiryRequestEntity, InquiryResponseEntity]> {
    return await this.inquiryResponseAccessoryService.findStuffForEmail(
      userId,
      inquiryRequestId,
      inquiryResponseId,
    );
  }
}
