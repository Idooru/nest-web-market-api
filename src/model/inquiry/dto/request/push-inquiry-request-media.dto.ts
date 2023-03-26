import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { InquiryRequestDto } from "./inquiry-request.dto";

export class PushInquiryRequestMediaDto {
  inquiryRequestDto: InquiryRequestDto;
  inquiryRequestImgCookies?: RequestMediaDto[];
  inquiryRequestVdoCookies?: RequestMediaDto[];
}
