import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryResponseDto } from "./inquiry-response.dto";

export class CreateInquiryResponseDto {
  inquiryRequestId: string;
  clientUserId: string;
  inquiryResponseDto: InquiryResponseDto;
}

export class CreateInquiryResponseDao {
  inquiryRequest: InquiryRequestEntity;
  inquiryResponseDto: InquiryResponseDto;
}
