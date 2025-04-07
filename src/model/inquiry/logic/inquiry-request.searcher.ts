import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { InquiryRequestEntity } from "../entities/inquiry-request.entity";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { Injectable } from "@nestjs/common";
import { InquiryRequestSearchRepository } from "../repositories/inquiry-request-search.repository";
import { InquiryRequestBasicRawDto } from "../dto/inquiry-request/response/inquiry-request-basic-raw.dto";
import { InquiryRequestDetailRawDto } from "../dto/inquiry-request/response/inquiry-request-detail-raw.dto";
import { InquiryRequestFromAdminProductRawDto } from "../dto/inquiry-request/response/inquiry-request-from-admin-product-raw.dto";
import { FindAllInquiryRequestsDto } from "../dto/inquiry-request/request/find-all-inquiry-requests.dto";

@Injectable()
export class InquiryRequestSearcher
  implements Searcher<InquiryRequestEntity, FindAllInquiryRequestsDto, InquiryRequestBasicRawDto>
{
  constructor(private readonly inquiryRequestSearchRepository: InquiryRequestSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<InquiryRequestEntity | InquiryRequestEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.inquiryRequestSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.inquiryRequestSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public findAllRaws(dto: FindAllInquiryRequestsDto): Promise<InquiryRequestBasicRawDto[]> {
    return this.inquiryRequestSearchRepository.findAllRaws(dto);
  }

  public findAllRawsFromProduct(id: string): Promise<InquiryRequestFromAdminProductRawDto[]> {
    return this.inquiryRequestSearchRepository.findAllRawsWithProductId(id);
  }

  public findDetailRaw(id: string): Promise<InquiryRequestDetailRawDto> {
    return this.inquiryRequestSearchRepository.findDetailRaw(id);
  }
}
