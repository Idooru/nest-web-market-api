import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryRequestDto } from "./inquiry-request.dto";

export class PushInquiryMediaDto {
  inquiryRequestDto: InquiryRequestDto;
  inquiryRequestImgCookies?: MediaDto[];
  inquiryRequestVdoCookies?: MediaDto[];
}
