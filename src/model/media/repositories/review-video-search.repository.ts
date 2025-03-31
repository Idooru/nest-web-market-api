import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MediaSelect } from "../../../common/config/repository-select-configs/media.select";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { ReviewVideoEntity } from "../entities/review-video.entity";

@Injectable()
export class ReviewVideoSearchRepository implements SearchRepository<ReviewVideoEntity> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(ReviewVideoEntity)
    private readonly repository: Repository<ReviewVideoEntity>,
  ) {}

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
    return getOne ? query.getOne() : query.getMany();
  }

  @Implemented
  public findOptionalEntity(args: FindOptionalEntityArgs): Promise<ReviewVideoEntity[] | ReviewVideoEntity> {
    const { property, alias, joinEntities, getOne } = args;
    let query = this.selectReviewVideo().where(property, alias);

    joinEntities.forEach((entity) => {
      const entityName = entity.name.replace("Entity", "");
      if (entityName) {
        try {
          query = query.leftJoinAndSelect(`reviewVideo.${entityName}`, entityName);
        } catch (err) {
          const message = `해당 ${entityName}Entity는 ReviewVideoEntity와 연관관계가 없습니다.`;
          loggerFactory("None Relation With ReviewVideoEntity").error(message);
          throw new InternalServerErrorException(message);
        }
      }
    });

    return getOne ? query.getOne() : query.getMany();
  }

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
