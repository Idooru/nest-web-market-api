import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { Injectable } from "@nestjs/common";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseSearchRepository } from "../repositories/inquiry-response-search.repository";
import { InquiryResponseBasicRawDto } from "../dto/inquiry-response/response/inquiry-response-basic-raw.dto";
import { InquiryResponseDetailRawDto } from "../dto/inquiry-response/response/inquiry-response-detail-raw.dto";
import { FindAllInquiryResponsesDto } from "../dto/inquiry-response/request/find-all-inquiry-responses.dto";

@Injectable()
export class InquiryResponseSearcher
  implements Searcher<InquiryResponseEntity, FindAllInquiryResponsesDto, InquiryResponseBasicRawDto>
{
  constructor(private readonly inquiryResponseSearchRepository: InquiryResponseSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<InquiryResponseEntity | InquiryResponseEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.inquiryResponseSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.inquiryResponseSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public findAllRaws(dto: FindAllInquiryResponsesDto): Promise<InquiryResponseBasicRawDto[]> {
    return this.inquiryResponseSearchRepository.findAllRaws(dto);
  }

  public findDetailRaw(id: string): Promise<InquiryResponseDetailRawDto> {
    return this.inquiryResponseSearchRepository.findDetailRaw(id);
  }
}
