import { InquiryResponseImageEntity } from "../../../../media/entities/inquiry-response-image.entity";
import { InquiryResponseEntity } from "../../../entities/inquiry-response.entity";

export class InsertInquiryResponseImageDto {
  public inquiryResponseImages: InquiryResponseImageEntity[];
  public inquiryResponse: InquiryResponseEntity;
}
