import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { MediaSelect } from "../../../common/config/repository-select-configs/media.select";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";

@Injectable()
export class InquiryResponseImageSearchRepository implements SearchRepository<InquiryResponseImageEntity> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(InquiryResponseImageEntity)
    private readonly repository: Repository<InquiryResponseImageEntity>,
  ) {}

  private selectInquiryResponseImage(selects?: string[]): SelectQueryBuilder<InquiryResponseImageEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(InquiryResponseImageEntity, "inquiryResponseImage");
    }
    return queryBuilder.select("inquiryResponseImage").from(InquiryResponseImageEntity, "inquiryResponseImage");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<InquiryResponseImageEntity[] | InquiryResponseImageEntity> {
    const { property, alias, getOne } = args;
    const query = this.selectInquiryResponseImage().where(property, alias);
    return getOne ? query.getOne() : query.getMany();
  }

  @Implemented
  public findOptionalEntity(
    args: FindOptionalEntityArgs,
  ): Promise<InquiryResponseImageEntity[] | InquiryResponseImageEntity> {
    const { property, alias, joinEntities, getOne } = args;
    let query = this.selectInquiryResponseImage().where(property, alias);

    joinEntities.forEach((entity) => {
      const entityName = entity.name.replace("Entity", "");
      if (entityName) {
        try {
          query = query.leftJoinAndSelect(`inquiryResponseImage.${entityName}`, entityName);
        } catch (err) {
          const message = `해당 ${entityName}Entity는 InquiryResponseImageEntity와 연관관계가 없습니다.`;
          loggerFactory("None Relation With InquiryResponseImageEntity").error(message);
          throw new InternalServerErrorException(message);
        }
      }
    });

    return getOne ? query.getOne() : query.getMany();
  }

  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    const raws = await Promise.all(
      dto.map((mediaCookie) =>
        this.selectInquiryResponseImage(this.select.inquiryResponseImages)
          .where("inquiryResponseImage.id = :id", { id: mediaCookie.id })
          .getRawOne(),
      ),
    );

    return raws.map((raw) => ({
      id: raw.inquiryResponseImageId,
      url: raw.inquiryResponseImageUrl,
      size: parseInt(raw.inquiryResponseImageSize),
    }));
  }
}
