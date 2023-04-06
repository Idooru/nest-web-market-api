import { ProductEntity } from "src/model/product/entities/product.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

export class SendMailToAdminAboutInquiryRequestDto {
  product: ProductEntity;
  inquiryRequest: InquiryRequestEntity;
}
