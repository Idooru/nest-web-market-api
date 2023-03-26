import { Injectable } from "@nestjs/common";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { CreateInquiryDto } from "../dto/create-inquiry.dto";
import {} from "../dto/inquiry-request.dto";
import { RequestInquiryEntity } from "../entities/request-inquiry.entity";
import { InquiryGeneralRepository } from "../repositories/inquiry-general.repository";
import { InquiryInsertRepository } from "../repositories/inquiry-insert.repository";
import { InquiryAccessoryService } from "./inquiry-accessory.service";

@Injectable()
export class InquiryGeneralService {
  constructor(
    private readonly inquiryGeneralRepository: InquiryGeneralRepository,
    private readonly productGenralRepository: ProductGeneralRepository,
    private readonly userGenralRepository: UserGeneralRepository,
    private readonly inquiryInsertRepository: InquiryInsertRepository,
    private readonly inquiryAccessoryService: InquiryAccessoryService,
  ) {}

  async createInquiry(
    createInquiryDto: CreateInquiryDto,
  ): Promise<RequestInquiryEntity> {
    const { inquiryRequestDto, jwtPayload, productId } = createInquiryDto;

    const [product, client] = await Promise.all([
      this.productGenralRepository.findProductOneById(productId),
      this.userGenralRepository.findClientUserObject(jwtPayload.userId),
    ]);

    await this.inquiryGeneralRepository.createInquiry({
      inquiryRequestDto,
      client,
      product,
    });

    const inquiry = await this.inquiryInsertRepository.findLastCreatedInquiry();
    await this.inquiryInsertRepository.insertInquiryIdOnClientUser(
      client,
      inquiry,
    );

    return inquiry;
  }
}
