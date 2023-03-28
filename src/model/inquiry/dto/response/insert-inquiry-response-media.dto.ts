import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class InsertInquiryResponseMediaDto {
  inquiryResponseDto: InquiryResponseDto;
  inquiryResponse: InquiryResponseEntity;
  inquiryResponseImgCookies?: RequestMediaDto[];
  inquiryResponseVdoCookies?: RequestMediaDto[];
}
