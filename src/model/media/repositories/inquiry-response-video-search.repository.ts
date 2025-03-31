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
import { InquiryResponseVideoEntity } from "../entities/inquiry-response-video.entity";

@Injectable()
export class InquiryResponseVideoSearchRepository implements SearchRepository<InquiryResponseVideoEntity> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(InquiryResponseVideoEntity)
    private readonly repository: Repository<InquiryResponseVideoEntity>,
  ) {}

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
    return getOne ? query.getOne() : query.getMany();
  }

  @Implemented
  public findOptionalEntity(
    args: FindOptionalEntityArgs,
  ): Promise<InquiryResponseVideoEntity[] | InquiryResponseVideoEntity> {
    const { property, alias, joinEntities, getOne } = args;
    let query = this.selectInquiryResponseVideo().where(property, alias);

    joinEntities.forEach((entity) => {
      const entityName = entity.name.replace("Entity", "");
      if (entityName) {
        try {
          query = query.leftJoinAndSelect(`inquiryResponseVideo.${entityName}`, entityName);
        } catch (err) {
          const message = `해당 ${entityName}Entity는 InquiryResponseVideoEntity와 연관관계가 없습니다.`;
          loggerFactory("None Relation With InquiryResponseVideoEntity").error(message);
          throw new InternalServerErrorException(message);
        }
      }
    });

    return getOne ? query.getOne() : query.getMany();
  }

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
