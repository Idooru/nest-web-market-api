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
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";

@Injectable()
export class InquiryResponseVideoSearchRepository extends SearchRepository<
  InquiryResponseVideoEntity,
  MediaCookieDto,
  MediaBasicRawDto
> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(InquiryResponseVideoEntity)
    private readonly repository: Repository<InquiryResponseVideoEntity>,
  ) {
    super();
  }

  private selectInquiryResponseVideo(selects?: string[]): SelectQueryBuilder<InquiryResponseVideoEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(InquiryResponseVideoEntity, "inquiryResponseVideo");
    }
    return queryBuilder.select("inquiryResponseVideo").from(InquiryResponseVideoEntity, "inquiryResponseVideo");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<InquiryResponseVideoEntity[] | InquiryResponseVideoEntity> {
    const { property, alias, getOne } = args;
    const query = this.selectInquiryResponseVideo().where(property, alias);
    return super.getEntity(getOne, query);
  }

  @Implemented
  public findOptionalEntity(
    args: FindOptionalEntityArgs,
  ): Promise<InquiryResponseVideoEntity[] | InquiryResponseVideoEntity> {
    const { property, alias, entities, getOne } = args;
    const query = this.selectInquiryResponseVideo().where(property, alias);
    super.joinEntity(entities, query, "inquiryResponseVideo");
    return super.getEntity(getOne, query);
  }

  @Implemented
  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    const raws = await Promise.all(
      dto.map((mediaCookie) =>
        this.selectInquiryResponseVideo(this.select.inquiryResponseVideos)
          .where("inquiryResponseVideo.id = :id", { id: mediaCookie.id })
          .getRawOne(),
      ),
    );

    return raws.map((raw) => ({
      id: raw.inquiryResponseVideoId,
      url: raw.inquiryResponseVideoUrl,
      size: parseInt(raw.inquiryResponseVideoSize),
    }));
  }
}
