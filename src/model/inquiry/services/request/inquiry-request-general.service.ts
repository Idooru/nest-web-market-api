import { Injectable } from "@nestjs/common";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { CreateInquiryRequestDto } from "../../dto/request/create-inquiry-request.dto";
import { InquiryRequestEntity } from "../../entities/inquiry-request.entity";
import { InquiryGeneralRepository } from "../../repositories/inquiry-general.repository";
import { InquiryInsertRepository } from "../../repositories/inquiry-insert.repository";
import { IInquiryRequestGeneralService } from "../../interfaces/services/request/inquiry-request-general-service.interface";
import { UserSearcher } from "src/model/user/logic/user.searcher";

@Injectable()
export class InquiryRequestGeneralService
  implements IInquiryRequestGeneralService
{
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly userSearcher: UserSearcher,
    private readonly inquiryInsertRepository: InquiryInsertRepository,
    private readonly inquiryGeneralRepository: InquiryGeneralRepository,
  ) {}

  async createInquiry(
    createInquiryRequestDto: CreateInquiryRequestDto,
  ): Promise<InquiryRequestEntity> {
    const { inquiryRequestDto, jwtPayload, productId } =
      createInquiryRequestDto;

    const [product, client] = await Promise.all([
      this.productGeneralRepository.findOneProductById(productId),
      this.userSearcher.findClientUserObjectWithId(jwtPayload.userId),
    ]);

    const inquiryRequestOutput =
      await this.inquiryGeneralRepository.createInquiryRequest({
        inquiryRequestDto,
        client,
        product,
      });

    const inquiryRequestId: string = inquiryRequestOutput.generatedMaps[0].id;

    const inquiryRequest =
      await this.inquiryInsertRepository.findOneInquiryRequestById(
        inquiryRequestId,
      );

    await this.inquiryInsertRepository.insertClientUserIdOnInquiryRequest(
      client,
      inquiryRequest,
    );

    return inquiryRequest;
  }
}
