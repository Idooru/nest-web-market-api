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
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";

@Injectable()
export class InquiryRequestVideoSearchRepository implements SearchRepository<InquiryRequestVideoEntity> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(InquiryRequestVideoEntity)
    private readonly repository: Repository<InquiryRequestVideoEntity>,
  ) {}

  private selectInquiryRequestVideo(selects?: string[]): SelectQueryBuilder<InquiryRequestVideoEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(InquiryRequestVideoEntity, "inquiryRequestVideo");
    }
    return queryBuilder.select("inquiryRequestVideo").from(InquiryRequestVideoEntity, "inquiryRequestVideo");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<InquiryRequestVideoEntity[] | InquiryRequestVideoEntity> {
    const { property, alias, getOne } = args;
    const query = this.selectInquiryRequestVideo().where(property, alias);
    return getOne ? query.getOne() : query.getMany();
  }

  @Implemented
  public findOptionalEntity(
    args: FindOptionalEntityArgs,
  ): Promise<InquiryRequestVideoEntity[] | InquiryRequestVideoEntity> {
    const { property, alias, joinEntities, getOne } = args;
    let query = this.selectInquiryRequestVideo().where(property, alias);

    joinEntities.forEach((entity) => {
      const entityName = entity.name.replace("Entity", "");
      if (entityName) {
        try {
          query = query.leftJoinAndSelect(`inquiryRequestVideo.${entityName}`, entityName);
        } catch (err) {
          const message = `해당 ${entityName}Entity는 InquiryRequestVideoEntity와 연관관계가 없습니다.`;
          loggerFactory("None Relation With InquiryRequestVideoEntity").error(message);
          throw new InternalServerErrorException(message);
        }
      }
    });

    return getOne ? query.getOne() : query.getMany();
  }

  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    const raws = await Promise.all(
      dto.map((mediaCookie) =>
        this.selectInquiryRequestVideo(this.select.inquiryRequestVideos)
          .where("inquiryRequestVideo.id = :id", { id: mediaCookie.id })
          .getRawOne(),
      ),
    );

    return raws.map((raw) => ({
      id: raw.inquiryRequestVideoId,
      url: raw.inquiryRequestVideoUrl,
      size: parseInt(raw.inquiryRequestVideoSize),
    }));
  }
}
