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
import { ReviewImageEntity } from "../entities/review-image.entity";

@Injectable()
export class ReviewImageSearchRepository implements SearchRepository<ReviewImageEntity> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(ReviewImageEntity)
    private readonly repository: Repository<ReviewImageEntity>,
  ) {}

  private selectReviewImage(selects?: string[]): SelectQueryBuilder<ReviewImageEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(ReviewImageEntity, "reviewImage");
    }
    return queryBuilder.select("reviewImage").from(ReviewImageEntity, "reviewImage");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<ReviewImageEntity[] | ReviewImageEntity> {
    const { property, alias, getOne } = args;
    const query = this.selectReviewImage().where(property, alias);
    return getOne ? query.getOne() : query.getMany();
  }

  @Implemented
  public findOptionalEntity(args: FindOptionalEntityArgs): Promise<ReviewImageEntity[] | ReviewImageEntity> {
    const { property, alias, joinEntities, getOne } = args;
    let query = this.selectReviewImage().where(property, alias);

    joinEntities.forEach((entity) => {
      const entityName = entity.name.replace("Entity", "");
      if (entityName) {
        try {
          query = query.leftJoinAndSelect(`reviewImage.${entityName}`, entityName);
        } catch (err) {
          const message = `해당 ${entityName}Entity는 ReviewImageEntity와 연관관계가 없습니다.`;
          loggerFactory("None Relation With ReviewImageEntity").error(message);
          throw new InternalServerErrorException(message);
        }
      }
    });

    return getOne ? query.getOne() : query.getMany();
  }

  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    const raws = await Promise.all(
      dto.map((mediaCookie) =>
        this.selectReviewImage(this.select.inquiryResponseImages)
          .where("reviewImage.id = :id", { id: mediaCookie.id })
          .getRawOne(),
      ),
    );

    return raws.map((raw) => ({
      id: raw.reviewImageId,
      url: raw.reviewImageUrl,
      size: parseInt(raw.reviewImageSize),
    }));
  }
}
