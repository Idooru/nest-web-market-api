import { Injectable } from "@nestjs/common";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { ReviewImageEntity } from "../entities/review-image.entity";
import { ReviewImageSearchRepository } from "../repositories/review-image-search.repository";

@Injectable()
export class ReviewImageSearcher implements Searcher<ReviewImageEntity, MediaCookieDto, MediaBasicRawDto> {
  constructor(private readonly inquiryResponseImageSearchRepository: ReviewImageSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<ReviewImageEntity | ReviewImageEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.inquiryResponseImageSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.inquiryResponseImageSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    return this.inquiryResponseImageSearchRepository.findAllRaws(dto);
  }
}
