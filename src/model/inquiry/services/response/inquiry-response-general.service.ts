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
      this.userGenralRepository.findAdminUserObjectWithId(jwtPayload.userId),
    ]);

    const inquiryResponseOutput =
      await this.inquiryGeneralRepository.createInquiryResponse(
        inquiryResponseDto,
      );

    const inquiryResponseId: string = inquiryResponseOutput.generatedMaps[0].id;

    const inquiryResponse =
      await this.inquiryInsertRepository.findOneInquiryResponseById(
        inquiryResponseId,
      );

    await Promise.all([
      this.inquiryInsertRepository.insertAdminUserIdOnInquiryResponse(
        admin,
        inquiryResponse,
      ),
      this.inquiryInsertRepository.insertInquiryRequestIdOnInquiryResponse(
        inquiryRequest,
        inquiryResponse,
      ),
      this.inquiryGeneralRepository.setIsAnsweredTrue(inquiryRequest),
    ]);

    return inquiryResponse;
  }
}
