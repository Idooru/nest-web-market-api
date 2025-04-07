import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { InquiryResponseImageEntity } from "../entities/inquiry-response-image.entity";
import { Inject, Injectable } from "@nestjs/common";
import { MediaSelect } from "../../../common/config/repository-select-configs/media.select";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";

@Injectable()
export class InquiryResponseImageSearchRepository extends SearchRepository<
  InquiryResponseImageEntity,
  MediaCookieDto,
  MediaBasicRawDto
> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(InquiryResponseImageEntity)
    private readonly repository: Repository<InquiryResponseImageEntity>,
  ) {
    super();
  }

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
    return super.getEntity(getOne, query);
  }

  @Implemented
  public findOptionalEntity(
    args: FindOptionalEntityArgs,
  ): Promise<InquiryResponseImageEntity[] | InquiryResponseImageEntity> {
    const { property, alias, entities, getOne } = args;
    const query = this.selectInquiryResponseImage().where(property, alias);
    super.joinEntity(entities, query, "inquiryResponseImage");
    return super.getEntity(getOne, query);
  }

  @Implemented
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
