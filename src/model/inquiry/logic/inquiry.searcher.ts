import { Injectable } from "@nestjs/common";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { InquirySearchRepository } from "../repositories/inquiry-search.repository";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { ProductEntity } from "../../product/entities/product.entity";

@Injectable()
export class InquirySearcher {
  constructor(private readonly repository: InquirySearchRepository) {}

  public findAllInquiryRequests(id: string): Promise<InquiryRequestEntity[]> {
    return this.repository.findAllInquiryRequests(id);
  }

  public findInquiryRequest(id: string): Promise<InquiryRequestEntity> {
    return this.repository.findInquiryRequest(id);
  }

  public findAllInquiryResponses(id: string): Promise<InquiryResponseEntity[]> {
    return this.repository.findAllInquiryResponses(id);
  }

  public findInquiryResponse(id: string): Promise<InquiryResponseEntity> {
    return this.repository.findInquiryResponse(id);
  }

  public findInquiryRequestFromAdminProduct(id: string): Promise<InquiryRequestEntity[]> {
    return this.repository.findInquiryRequestFromAdminProduct(id);
  }
}
