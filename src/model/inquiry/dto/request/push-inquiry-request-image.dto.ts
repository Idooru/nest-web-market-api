import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryRequestDto } from "./inquiry-request.dto";

export class PushInquiryRequestImageDto {
  inquiryRequestDto: InquiryRequestDto;
  inquiryRequestImgCookies: MediaDto[];
}
