import { Injectable } from "@nestjs/common";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { InquiryRequestVideoSearchRepository } from "../repositories/inquiry-request-video-search.repository";

@Injectable()
export class InquiryRequestVideoSearcher implements Searcher<InquiryRequestVideoEntity> {
  constructor(private readonly inquiryRequestVideoSearchRepository: InquiryRequestVideoSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<InquiryRequestVideoEntity | InquiryRequestVideoEntity[]> {
    const { property, alias, getOne, joinEntities } = args;
    if (joinEntities && joinEntities.length) {
      return this.inquiryRequestVideoSearchRepository.findOptionalEntity({ property, alias, joinEntities, getOne });
    }
    return this.inquiryRequestVideoSearchRepository.findPureEntity({ property, alias, getOne });
  }

  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    return this.inquiryRequestVideoSearchRepository.findAllRaws(dto);
  }
}
