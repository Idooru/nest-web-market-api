import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class PushInquiryResponseMediaDto {
  inquiryResponseDto: InquiryResponseDto;
  inquiryResponseImgCookies?: MediaDto[];
  inquiryResponseVdoCookies?: MediaDto[];
}
