import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class PushInquiryMediaDto {
  inquiryResponseDto: InquiryResponseDto;
  inquiryResponseImgCookies?: MediaDto[];
  inquiryResponseVdoCookies?: MediaDto[];
}
