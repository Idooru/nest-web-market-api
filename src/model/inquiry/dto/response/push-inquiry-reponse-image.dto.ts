import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class PushInquiryResponseImageDto {
  inquiryResponseDto: InquiryResponseDto;
  inquiryResponseImgCookies: RequestMediaDto[];
}
