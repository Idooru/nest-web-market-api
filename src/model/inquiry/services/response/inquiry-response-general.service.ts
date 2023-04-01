import { Injectable } from "@nestjs/common";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { CreateInquiryResponseDto } from "../../dto/response/create-inquiry-response.dto";
import { InquiryResponseEntity } from "../../entities/inquiry-response.entity";
import { InquiryGeneralRepository } from "../../repositories/inquiry-general.repository";
import { InquiryInsertRepository } from "../../repositories/inquiry-insert.repository";

@Injectable()
export class InquiryResponseGeneralService {
  constructor(
    private readonly inquiryGeneralRepository: InquiryGeneralRepository,
    private readonly userGenralRepository: UserGeneralRepository,
    private readonly inquiryInsertRepository: InquiryInsertRepository,
  ) {}

  async createInquiry(
    createInquiryResponseDto: CreateInquiryResponseDto,
  ): Promise<InquiryResponseEntity> {
    const { inquiryResponseDto, inquiryRequestId, jwtPayload } =
      createInquiryResponseDto;

    const [inquiryRequest, admin] = await Promise.all([
      this.inquiryGeneralRepository.findInquiryRequestWithId(inquiryRequestId),
      this.userGenralRepository.findAdminUserObject(jwtPayload.userId),
    ]);

    await this.inquiryGeneralRepository.createInquiryResponse(
      inquiryResponseDto,
    );

    const lastCreatedInquiryResponse =
      await this.inquiryInsertRepository.findLastCreatedInquiryResponse();
    await this.inquiryInsertRepository.insertAdminUserIdOnInquiryResponse(
      admin,
      lastCreatedInquiryResponse,
    );

    await this.inquiryGeneralRepository.setIsAnsweredTrue(inquiryRequest);

    return lastCreatedInquiryResponse;
  }
}
