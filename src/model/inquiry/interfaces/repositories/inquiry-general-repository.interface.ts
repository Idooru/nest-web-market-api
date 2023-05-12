import { InsertResult } from "typeorm";
import { CreateInquiryRequestDao } from "../../dto/request/create-inquiry-request.dto";
import { InquiryResponseDto } from "../../dto/response/inquiry-response.dto";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";

export interface IInquiryGeneralRepository {
  createInquiryRequest(
    createInquiryDao: CreateInquiryRequestDao,
  ): Promise<InsertResult>;
  createInquiryResponse(
    inquiryResponseDto: InquiryResponseDto,
  ): Promise<InsertResult>;
  findInquiryRequestWithId(id: string): Promise<InquiryRequestEntity>;
  findInquiryResponseWithId(id: string): Promise<InquiryResponseEntity>;
  setIsAnsweredTrue(inquiryRequest: InquiryRequestEntity): Promise<void>;
}
