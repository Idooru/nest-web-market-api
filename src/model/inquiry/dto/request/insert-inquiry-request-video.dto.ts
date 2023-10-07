import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryRequestVideoEntity } from "../../../media/entities/inquiry-request-video.entity";

export class InsertInquiryRequestVideoDto {
  inquiryRequestVideos: InquiryRequestVideoEntity[];
  inquiryRequest: InquiryRequestEntity;
}
