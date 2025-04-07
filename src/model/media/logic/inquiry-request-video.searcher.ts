import { Injectable } from "@nestjs/common";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { InquiryRequestVideoSearchRepository } from "../repositories/inquiry-request-video-search.repository";

@Injectable()
export class InquiryRequestVideoSearcher
  implements Searcher<InquiryRequestVideoEntity, MediaCookieDto, MediaBasicRawDto>
{
  constructor(private readonly inquiryRequestVideoSearchRepository: InquiryRequestVideoSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<InquiryRequestVideoEntity | InquiryRequestVideoEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.inquiryRequestVideoSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.inquiryRequestVideoSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    return this.inquiryRequestVideoSearchRepository.findAllRaws(dto);
  }
}
