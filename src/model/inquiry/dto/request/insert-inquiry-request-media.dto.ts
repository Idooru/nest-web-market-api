import { MediaDto } from "src/model/media/dto/media.dto";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryRequestDto } from "./inquiry-request.dto";

export class InsertInquiryRequestMediaDto {
  inquiryRequestDto: InquiryRequestDto;
  inquiryRequest: InquiryRequestEntity;
  inquiryRequestImgCookies?: MediaDto[];
  inquiryRequestVdoCookies?: MediaDto[];
}
