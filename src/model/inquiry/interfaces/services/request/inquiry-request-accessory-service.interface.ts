import { InquiryRequestDto } from "src/model/inquiry/dto/request/inquiry-request.dto";
import { PushInquiryRequestImageDto } from "src/model/inquiry/dto/request/push-inquiry-request-image.dto";
import { PushInquiryRequestVideoDto } from "src/model/inquiry/dto/request/push-inquiry-request-video.dto";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryRequestImageEntity } from "src/model/media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "src/model/media/entities/inquiry-request-video.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";

export interface IInquiryRequestAccessoryService {
  pushMoreThenTwoInquiryImageInDto(
    inquiryRequestImgCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void>;
  pushOneInquiryImageInDto(
    inquiryRequestImgCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void>;
  pushMoreThenTwoInquiryVideoInDto(
    inquiryRequestVdoCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void>;
  pushOneInquiryVideoInDto(
    inquiryRequestVdoCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
  ): Promise<void>;
  insertInquiryIdOneMoreThenTwoInquiryImage(
    inquiryRequestImages: InquiryRequestImageEntity[],
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void>;
  insertInquiryIdOnOneInquiryImage(
    inquiryRequestImage: InquiryRequestImageEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void>;
  insertInquiryIdOneMoreThenTwoInquiryVideo(
    inquiryRequestVideos: InquiryRequestVideoEntity[],
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void>;
  insertInquiryIdOnOneInquiryVideo(
    inquiryRequestVideo: InquiryRequestVideoEntity,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void>;
  pushInquiryImages(
    pushInquiryRequestImageDto: PushInquiryRequestImageDto,
  ): Promise<void>;
  pushInquiryVideos(
    pushInquiryRequestVideoDto: PushInquiryRequestVideoDto,
  ): Promise<void>;
  insertInquiryImages(
    inquiryRequestImgCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void>;
  insertInquiryVideos(
    inquiryRequestVdoCookies: MediaDto[],
    inquiryRequestDto: InquiryRequestDto,
    inquiryRequest: InquiryRequestEntity,
  ): Promise<void>;
  findStuffForEmail(
    productId: string,
    inquiryRequestId: string,
  ): Promise<[ProductEntity, InquiryRequestEntity]>;
}
