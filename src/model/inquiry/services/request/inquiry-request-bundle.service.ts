import { Injectable } from "@nestjs/common";
import { InsertInquiryRequestMediaDto } from "../../dto/request/insert-inquiry-request-media.dto";
import { PushInquiryMediaDto } from "../../dto/request/push-inquiry-request-media.dto";
import { InquiryRequestAccessoryService } from "./inquiry-request-accessory.service";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

@Injectable()
export class InquiryRequestBundleService {
  constructor(
    private readonly inquiryRequestAccessoryService: InquiryRequestAccessoryService,
  ) {}

  async pushInquiryMedia(
    pushInquiryMediaDto: PushInquiryMediaDto,
  ): Promise<void> {
    const {
      inquiryRequestDto,
      inquiryRequestImgCookies,
      inquiryRequestVdoCookies,
    } = pushInquiryMediaDto;

    if (inquiryRequestImgCookies) {
      await this.inquiryRequestAccessoryService.distinguishInquiryImagesCountForPush(
        {
          inquiryRequestDto,
          inquiryRequestImgCookies,
        },
      );
    }

    if (inquiryRequestVdoCookies) {
      await this.inquiryRequestAccessoryService.distinguishInquiryVideosCountForPush(
        {
          inquiryRequestDto,
          inquiryRequestVdoCookies,
        },
      );
    }
  }

  async insertInquiryMedia(
    insertInquiryMediaDto: InsertInquiryRequestMediaDto,
  ): Promise<void> {
    const {
      inquiryRequestImgCookies,
      inquiryRequestVdoCookies,
      inquiryRequest,
      inquiryRequestDto,
    } = insertInquiryMediaDto;

    if (inquiryRequestImgCookies) {
      await this.inquiryRequestAccessoryService.distinguishInquiryImagesCountForInsert(
        inquiryRequestImgCookies,
        inquiryRequestDto,
        inquiryRequest,
      );
    }

    if (inquiryRequestVdoCookies) {
      await this.inquiryRequestAccessoryService.distinguishInquiryVideosCountForInsert(
        inquiryRequestVdoCookies,
        inquiryRequestDto,
        inquiryRequest,
      );
    }
  }

  async findStuffForEmail(
    productId: string,
  ): Promise<[ProductEntity, InquiryRequestEntity]> {
    return await this.inquiryRequestAccessoryService.findStuffForEmail(
      productId,
    );
  }
}
