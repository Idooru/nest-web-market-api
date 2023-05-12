import { CreateInquiryResponseDto } from "src/model/inquiry/dto/response/create-inquiry-response.dto";
import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";

export interface IInquiryResponseGeneralService {
  createInquiry(
    createInquiryResponseDto: CreateInquiryResponseDto,
  ): Promise<InquiryResponseEntity>;
}
