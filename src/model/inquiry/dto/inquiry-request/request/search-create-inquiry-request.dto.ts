import { InquiryRequestBody } from "./inquiry-request-body";
import { ProductEntity } from "../../../../product/entities/product.entity";
import { ClientUserEntity } from "../../../../user/entities/client-user.entity";
import { InquiryRequestImageEntity } from "../../../../media/entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../../../../media/entities/inquiry-request-video.entity";

export class SearchCreateInquiryRequestDto {
  public body: InquiryRequestBody;
  public product: ProductEntity;
  public clientUser: ClientUserEntity;
  public inquiryRequestImages: InquiryRequestImageEntity[];
  public inquiryRequestVideos: InquiryRequestVideoEntity[];
}
