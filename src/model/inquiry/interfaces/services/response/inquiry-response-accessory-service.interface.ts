import { InquiryResponseDto } from "src/model/inquiry/dto/response/inquiry-response.dto";
import { PushInquiryResponseImageDto } from "src/model/inquiry/dto/response/push-inquiry-reponse-image.dto";
import { PushInquiryResponseVideoDto } from "src/model/inquiry/dto/response/push-inquiry-response-video.dto";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryResponseImageEntity } from "src/model/media/entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "src/model/media/entities/inquiry-response-video.entity";
import { UserEntity } from "src/model/user/entities/user.entity";

export interface IInquiryResponseAccessoryService {
  pushMoreThenTwoInquiryImageInDto(
    inquiryResponseImgCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<void>;
  pushOneInquiryImageInDto(
    inquiryResponseImgCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<void>;
  pushMoreThenTwoInquiryVideoInDto(
    inquiryResponseVdoCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<void>;
  pushOneInquiryVideoInDto(
    inquiryResponseVdoCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<void>;
  insertInquiryIdOneMoreThenTwoInquiryImage(
    inquiryResponseImages: InquiryResponseImageEntity[],
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
  insertInquiryIdOnOneInquiryImage(
    inquiryResponseImage: InquiryResponseImageEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
  insertInquiryIdOneMoreThenTwoInquiryVideo(
    inquiryResponseVideos: InquiryResponseVideoEntity[],
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
  insertInquiryIdOnOneInquiryVideo(
    inquiryResponseVideo: InquiryResponseVideoEntity,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
  pushInquiryImages(
    pushInquiryResponseImageDto: PushInquiryResponseImageDto,
  ): Promise<void>;
  pushInquiryVideos(
    pushInquiryResponseVideoDto: PushInquiryResponseVideoDto,
  ): Promise<void>;
  insertInquiryImages(
    inquiryResponseImgCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
  insertInquiryVideos(
    inquiryResponseVdoCookies: MediaDto[],
    inquiryResponseDto: InquiryResponseDto,
    inquiryResponse: InquiryResponseEntity,
  ): Promise<void>;
  findStuffForEmail(
    userId: string,
    inquiryRequestId: string,
    inquiryResponseId: string,
  ): Promise<[UserEntity, InquiryRequestEntity, InquiryResponseEntity]>;
}
