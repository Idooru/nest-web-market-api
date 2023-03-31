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
    const { inquiryResponseDto, inquiryRequestId, clientUserId, jwtPayload } =
      createInquiryResponseDto;

    const [inquiryRequest, client] = await Promise.all([
      this.inquiryGeneralRepository.findInquiryRequestWithId(inquiryRequestId),
      this.userGenralRepository.findClientUserObject(clientUserId),
    ]);

    await this.inquiryGeneralRepository.createInquiryResponse({
      inquiryResponseDto,
      inquiryRequest,
    });

    const lastCreatedInquiryResponse =
      await this.inquiryInsertRepository.findLastCreatedInquiryResponse();
    await this.inquiryInsertRepository.insertClientUserIdOnInquiryResponse(
      client,
      lastCreatedInquiryResponse,
    );

    const admin = await this.userGenralRepository.findAdminUserObject(
      jwtPayload.userId,
    );
    await this.inquiryInsertRepository.insertAdminUserIdOnInquiryResponse(
      admin,
      lastCreatedInquiryResponse,
    );

    return lastCreatedInquiryResponse;
  }
}
