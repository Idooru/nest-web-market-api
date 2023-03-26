import { RequestMediaDto } from "../../../media/dto/request-media.dto";
import { InquiryRequestDto } from "./inquiry-request.dto";

export class PushInquiryRequestVideoDto {
  createInquiryRequestDto: InquiryRequestDto;
  inquiryRequestVdoCookies: RequestMediaDto[];
}
