import { InquiryRequestVideoEntity } from "../../../../media/entities/inquiry-request-video.entity";
import { InquiryRequestEntity } from "../../../entities/inquiry-request.entity";

export class InsertInquiryRequestVideoDto {
  public inquiryRequestVideos: InquiryRequestVideoEntity[];
  public inquiryRequest: InquiryRequestEntity;
}
