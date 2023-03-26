import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryRequestDto } from "./inquiry-request.dto";

export class InsertInquiryRequestMediaDto {
  createInquiryRequestDto: InquiryRequestDto;
  inquiryRequest: InquiryRequestEntity;
  inquiryRequestImgCookies?: RequestMediaDto[];
  inquiryRequestVdoCookies?: RequestMediaDto[];
}
