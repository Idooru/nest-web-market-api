import { PushInquiryMediaDto } from "src/model/inquiry/dto/request/push-inquiry-request-media.dto";
import { InsertInquiryResponseMediaDto } from "src/model/inquiry/dto/response/insert-inquiry-response-media.dto";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { UserEntity } from "src/model/user/entities/user.entity";

export interface IInquiryResponseBundleService {
  pushInquiryMedia(pushInquiryMediaDto: PushInquiryMediaDto): Promise<void>;
  insertInquiryMedia(
    insertInquiryMediaDto: InsertInquiryResponseMediaDto,
  ): Promise<void>;
  findStuffForEmail(
    userId: string,
    inquiryRequestId: string,
    inquiryResponseId: string,
  ): Promise<[UserEntity, InquiryRequestEntity, InquiryResponseEntity]>;
}
