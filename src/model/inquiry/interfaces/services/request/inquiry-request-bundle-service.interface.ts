import { InsertInquiryRequestMediaDto } from "src/model/inquiry/dto/request/insert-inquiry-request-media.dto";
import { PushInquiryRequestMediaDto } from "src/model/inquiry/dto/request/push-inquiry-request-media.dto";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";

export interface IInquiryRequestBundleService {
  pushInquiryMedia(
    pushInquiryMediaDto: PushInquiryRequestMediaDto,
  ): Promise<void>;
  insertInquiryMedia(
    insertInquiryMediaDto: InsertInquiryRequestMediaDto,
  ): Promise<void>;
  findStuffForEmail(
    productId: string,
    inquiryRequestId: string,
  ): Promise<[ProductEntity, InquiryRequestEntity]>;
}
