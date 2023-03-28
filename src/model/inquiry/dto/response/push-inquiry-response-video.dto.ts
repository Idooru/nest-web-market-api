import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class PushInquiryResponseVideoDto {
  inquiryResponseDto: InquiryResponseDto;
  inquiryResponseVdoCookies: RequestMediaDto[];
}
