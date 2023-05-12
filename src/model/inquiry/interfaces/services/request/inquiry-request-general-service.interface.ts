import { CreateInquiryRequestDto } from "src/model/inquiry/dto/request/create-inquiry-request.dto";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";

export interface IInquiryRequestGeneralService {
  createInquiry(
    createInquiryRequestDto: CreateInquiryRequestDto,
  ): Promise<InquiryRequestEntity>;
}
