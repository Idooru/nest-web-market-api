import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class InsertInquiryResponseMediaDto {
  inquiryResponseDto: InquiryResponseDto;
  inquiryResponse: InquiryResponseEntity;
  inquiryResponseImgCookies?: MediaDto[];
  inquiryResponseVdoCookies?: MediaDto[];
}
