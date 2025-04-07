import { Injectable } from "@nestjs/common";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { ReviewVideoEntity } from "../entities/review-video.entity";
import { ReviewVideoSearchRepository } from "../repositories/review-video-search.repository";

@Injectable()
export class ReviewVideoSearcher implements Searcher<ReviewVideoEntity, MediaCookieDto, MediaBasicRawDto> {
  constructor(private readonly inquiryResponseVideoSearchRepository: ReviewVideoSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<ReviewVideoEntity | ReviewVideoEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.inquiryResponseVideoSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.inquiryResponseVideoSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    return this.inquiryResponseVideoSearchRepository.findAllRaws(dto);
  }
}
