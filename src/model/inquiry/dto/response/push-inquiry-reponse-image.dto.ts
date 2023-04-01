import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class PushInquiryResponseImageDto {
  inquiryResponseDto: InquiryResponseDto;
  inquiryResponseImgCookies: MediaDto[];
}
