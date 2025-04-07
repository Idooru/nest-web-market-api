import { Injectable } from "@nestjs/common";
import { ReviewSearchRepository } from "../repositories/review-search.repository";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewBasicRawDto } from "../dto/response/review-basic-raw.dto";
import { ReviewDetailRawDto } from "../dto/response/review-detail-raw.dto";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { ReviewFromProductRawDto } from "../dto/response/review-from-product-raw.dto";
import { FindAllReviewsDto } from "../dto/request/find-all-reviews.dto";

@Injectable()
export class ReviewSearcher implements Searcher<ReviewEntity, FindAllReviewsDto, ReviewBasicRawDto> {
  constructor(private readonly reviewSearchRepository: ReviewSearchRepository) {}

  @Implemented
  public async findEntity(args: FindEntityArgs): Promise<ReviewEntity | ReviewEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.reviewSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.reviewSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public findAllRaws(dto: FindAllReviewsDto): Promise<ReviewBasicRawDto[]> {
    return this.reviewSearchRepository.findAllRaws(dto);
  }

  public async findAllRawsWithProductId(id: string): Promise<ReviewFromProductRawDto[]> {
    return this.reviewSearchRepository.findAllRawsWithProductId(id);
  }

  public findDetailRaw(id: string): Promise<ReviewDetailRawDto> {
    return this.reviewSearchRepository.findDetailRaw(id);
  }
}
