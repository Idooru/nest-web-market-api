import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { Inject, Injectable } from "@nestjs/common";
import { MediaSelect } from "../../../common/config/repository-select-configs/media.select";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { ReviewVideoEntity } from "../entities/review-video.entity";

@Injectable()
export class ReviewVideoSearchRepository extends SearchRepository<ReviewVideoEntity, MediaCookieDto, MediaBasicRawDto> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(ReviewVideoEntity)
    private readonly repository: Repository<ReviewVideoEntity>,
  ) {
    super();
  }

  private selectReviewVideo(selects?: string[]): SelectQueryBuilder<ReviewVideoEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(ReviewVideoEntity, "reviewVideo");
    }
    return queryBuilder.select("reviewVideo").from(ReviewVideoEntity, "reviewVideo");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<ReviewVideoEntity[] | ReviewVideoEntity> {
    const { property, alias, getOne } = args;
    const query = this.selectReviewVideo().where(property, alias);
    return super.getEntity(getOne, query);
  }

  @Implemented
  public findOptionalEntity(args: FindOptionalEntityArgs): Promise<ReviewVideoEntity[] | ReviewVideoEntity> {
    const { property, alias, entities, getOne } = args;
    const query = this.selectReviewVideo().where(property, alias);
    super.joinEntity(entities, query, "reviewVideo");
    return super.getEntity(getOne, query);
  }

  @Implemented
  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    const raws = await Promise.all(
      dto.map((mediaCookie) =>
        this.selectReviewVideo(this.select.inquiryResponseVideos)
          .where("reviewVideo.id = :id", { id: mediaCookie.id })
          .getRawOne(),
      ),
    );

    return raws.map((raw) => ({
      id: raw.reviewVideoId,
      url: raw.reviewVideoUrl,
      size: parseInt(raw.reviewVideoSize),
    }));
  }
}
