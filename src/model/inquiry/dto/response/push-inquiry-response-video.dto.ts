import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class PushInquiryResponseVideoDto {
  inquiryResponseDto: InquiryResponseDto;
  inquiryResponseVdoCookies: MediaDto[];
}
