import { Injectable } from "@nestjs/common";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestImageSearchRepository } from "../repositories/inquiry-request-image-search.repository";

@Injectable()
export class InquiryRequestImageSearcher implements Searcher<InquiryRequestImageEntity> {
  constructor(private readonly inquiryRequestImageSearchRepository: InquiryRequestImageSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<InquiryRequestImageEntity | InquiryRequestImageEntity[]> {
    const { property, alias, getOne, joinEntities } = args;
    if (joinEntities && joinEntities.length) {
      return this.inquiryRequestImageSearchRepository.findOptionalEntity({ property, alias, joinEntities, getOne });
    }
    return this.inquiryRequestImageSearchRepository.findPureEntity({ property, alias, getOne });
  }

  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    return this.inquiryRequestImageSearchRepository.findAllRaws(dto);
  }
}
