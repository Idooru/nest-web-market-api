import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryRequestDto } from "./inquiry-request.dto";

export class PushInquiryRequestMediaDto {
  inquiryRequestDto: InquiryRequestDto;
  inquiryRequestImgCookies?: MediaDto[];
  inquiryRequestVdoCookies?: MediaDto[];
}
