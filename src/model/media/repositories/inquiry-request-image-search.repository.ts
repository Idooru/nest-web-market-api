import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MediaSelect } from "../../../common/config/repository-select-configs/media.select";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";

@Injectable()
export class InquiryRequestImageSearchRepository extends SearchRepository<
  InquiryRequestImageEntity,
  MediaCookieDto,
  MediaBasicRawDto
> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(InquiryRequestImageEntity)
    private readonly repository: Repository<InquiryRequestImageEntity>,
  ) {
    super();
  }

  private selectInquiryRequestImage(selects?: string[]): SelectQueryBuilder<InquiryRequestImageEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(InquiryRequestImageEntity, "inquiryRequestImage");
    }
    return queryBuilder.select("inquiryRequestImage").from(InquiryRequestImageEntity, "inquiryRequestImage");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<InquiryRequestImageEntity[] | InquiryRequestImageEntity> {
    const { property, alias, getOne } = args;
    const query = this.selectInquiryRequestImage().where(property, alias);
    return getOne ? query.getOne() : query.getMany();
  }

  @Implemented
  public findOptionalEntity(
    args: FindOptionalEntityArgs,
  ): Promise<InquiryRequestImageEntity[] | InquiryRequestImageEntity> {
    const { property, alias, entities, getOne } = args;
    let query = this.selectInquiryRequestImage().where(property, alias);

    entities.forEach((entity) => {
      const entityName = entity.name.replace("Entity", "");
      if (entityName) {
        try {
          query = query.leftJoinAndSelect(`inquiryRequestImage.${entityName}`, entityName);
        } catch (err) {
          const message = `해당 ${entityName}Entity는 InquiryRequestImageEntity와 연관관계가 없습니다.`;
          loggerFactory("None Relation With InquiryRequestImageEntity").error(message);
          throw new InternalServerErrorException(message);
        }
      }
    });

    return getOne ? query.getOne() : query.getMany();
  }

  @Implemented
  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    const raws = await Promise.all(
      dto.map((mediaCookie) =>
        this.selectInquiryRequestImage(this.select.inquiryRequestImages)
          .where("inquiryRequestImage.id = :id", { id: mediaCookie.id })
          .getRawOne(),
      ),
    );

    return raws.map((raw) => ({
      id: raw.inquiryRequestImageId,
      url: raw.inquiryRequestImageUrl,
      size: parseInt(raw.inquiryRequestImageSize),
    }));
  }
}
