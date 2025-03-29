import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { Injectable } from "@nestjs/common";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseSearchRepository } from "../repositories/inquiry-response-search.repository";
import { InquiryResponseBasicRawDto } from "../dto/inquiry-response/response/inquiry-response-basic-raw.dto";
import { InquiryResponseDetailRawDto } from "../dto/inquiry-response/response/inquiry-response-detail-raw.dto";
import { FindAllInquiryResponsesDto } from "../dto/inquiry-response/request/find-all-inquiry-responses.dto";

@Injectable()
export class InquiryResponseSearcher implements Searcher<InquiryResponseEntity> {
  constructor(private readonly inquiryResponseSearchRepository: InquiryResponseSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<InquiryResponseEntity | InquiryResponseEntity[]> {
    const { property, alias, getOne, joinEntities } = args;
    if (joinEntities && joinEntities.length) {
      return this.inquiryResponseSearchRepository.findOptionalEntity({ property, alias, joinEntities, getOne });
    }
    return this.inquiryResponseSearchRepository.findPureEntity({ property, alias, getOne });
  }

  public findAllRaws(dto: FindAllInquiryResponsesDto): Promise<InquiryResponseBasicRawDto[]> {
    return this.inquiryResponseSearchRepository.findAllRaws(dto);
  }

  public findDetailRaw(id: string): Promise<InquiryResponseDetailRawDto> {
    return this.inquiryResponseSearchRepository.findDetailRaw(id);
  }
}
