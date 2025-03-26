import { InquiryResponseVideoEntity } from "../../../../media/entities/inquiry-response-video.entity";
import { InquiryResponseEntity } from "../../../entities/inquiry-response.entity";

export class InsertInquiryResponseVideoDto {
  public inquiryResponseVideos: InquiryResponseVideoEntity[];
  public inquiryResponse: InquiryResponseEntity;
}
