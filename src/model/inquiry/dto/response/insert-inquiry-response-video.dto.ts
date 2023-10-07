import { InquiryResponseVideoEntity } from "../../../media/entities/inquiry-response-video.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";

export class InsertInquiryResponseVideoDto {
  inquiryResponseVideos: InquiryResponseVideoEntity[];
  inquiryResponse: InquiryResponseEntity;
}
