import { Injectable } from "@nestjs/common";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InquirySearchRepository } from "../repositories/inquiry-search.repository";

@Injectable()
export class InquirySearcher {
  constructor(
    private readonly inquirySearchRepository: InquirySearchRepository,
  ) {}

  public async findInquiryRequestWithId(
    id: string,
  ): Promise<InquiryRequestEntity> {
    return await this.inquirySearchRepository.findInquiryRequestWithId(id);
  }
}
