import { InquiryRequestImageEntity } from "../../../media/entities/inquiry-request-image.entity";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";

export class InsertInquiryRequestImageDto {
  inquiryRequestImages: InquiryRequestImageEntity[];
  inquiryRequest: InquiryRequestEntity;
}
