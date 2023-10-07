import { Inject, Injectable } from "@nestjs/common";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InquirySelectProperty } from "../../../common/config/repository-select-configs/inquiry.select";

@Injectable()
export class InquirySearchRepository {
  constructor(
    @InjectRepository(InquiryRequestEntity)
    private readonly inquiryRequestRepository: Repository<InquiryRequestEntity>,
    @Inject("InquirySelectProperty")
    private readonly select: InquirySelectProperty,
  ) {}

  public async findInquiryRequestWithId(
    id: string,
  ): Promise<InquiryRequestEntity> {
    return await this.inquiryRequestRepository
      .createQueryBuilder()
      .select(this.select.inquiryRequest)
      .from(InquiryRequestEntity, "inquiryRequest")
      .innerJoin("inquiryRequest.Product", "Product")
      .where("inquiryRequest.id = :id", { id })
      .getOne();
  }
}
