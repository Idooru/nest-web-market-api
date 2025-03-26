import { ProductEntity } from "src/model/product/entities/product.entity";
import { InquiryRequestEntity } from "../../../entities/inquiry-request.entity";
import { ClientUserEntity } from "../../../../user/entities/client-user.entity";

export class SendMailToAdminAboutInquiryRequestDto {
  public product: ProductEntity;
  public inquiryRequest: InquiryRequestEntity;
  public clientUser: ClientUserEntity;
}
