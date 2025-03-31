import { Injectable } from "@nestjs/common";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";
import { InquiryResponseVideoSearchRepository } from "../repositories/inquiry-response-video-search.repository";

@Injectable()
export class InquiryResponseVideoSearcher implements Searcher<InquiryResponseVideoEntity> {
  constructor(private readonly inquiryResponseVideoSearchRepository: InquiryResponseVideoSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<InquiryResponseVideoEntity | InquiryResponseVideoEntity[]> {
    const { property, alias, getOne, joinEntities } = args;
    if (joinEntities && joinEntities.length) {
      return this.inquiryResponseVideoSearchRepository.findOptionalEntity({ property, alias, joinEntities, getOne });
    }
    return this.inquiryResponseVideoSearchRepository.findPureEntity({ property, alias, getOne });
  }

  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    return this.inquiryResponseVideoSearchRepository.findAllRaws(dto);
  }
}
