import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { InquirySelect } from "../../../common/config/repository-select-configs/inquiry.select";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { InquiryResponseEntity } from "../entities/inquiry-response.entity";
import { InquiryResponseBasicRawDto } from "../dto/inquiry-response/response/inquiry-response-basic-raw.dto";
import { InquiryResponseDetailRawDto } from "../dto/inquiry-response/response/inquiry-response-detail-raw.dto";
import { FindAllInquiryResponsesDto } from "../dto/inquiry-response/request/find-all-inquiry-responses.dto";

@Injectable()
export class InquiryResponseSearchRepository implements SearchRepository<InquiryResponseEntity> {
  constructor(
    @Inject("inquiry-select")
    private readonly select: InquirySelect,
    @InjectRepository(InquiryResponseEntity) private readonly repository: Repository<InquiryResponseEntity>,
  ) {}

  private selectInquiryResponse(selects?: string[]): SelectQueryBuilder<InquiryResponseEntity> {
    if (selects && selects.length) {
      return this.repository.createQueryBuilder().select(selects).from(InquiryResponseEntity, "inquiryResponse");
    }
    return this.repository
      .createQueryBuilder()
      .select("inquiryResponse")
      .from(InquiryResponseEntity, "inquiryResponse");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<InquiryResponseEntity | InquiryResponseEntity[]> {
    const { property, alias, getOne } = args;
    const query = this.selectInquiryResponse().where(property, alias);
    return getOne ? query.getOne() : query.getMany();
  }

  @Implemented
  public findOptionalEntity(args: FindOptionalEntityArgs): Promise<InquiryResponseEntity | InquiryResponseEntity[]> {
    const { property, alias, joinEntities, getOne } = args;
    let query = this.selectInquiryResponse().where(property, alias);

    joinEntities.forEach((entity) => {
      const entityName = entity.name.replace("Entity", "");
      if (entityName) {
        try {
          query = query.leftJoinAndSelect(`inquiryResponse.${entityName}`, entityName);
        } catch (err) {
          const message = `해당 ${entityName}Entity는 InquiryRequestEntity와 연관관계가 없습니다.`;
          loggerFactory("None Relation With InquiryRequestEntity").error(message);
          throw new InternalServerErrorException(message);
        }
      }
    });

    return getOne ? query.getOne() : query.getMany();
  }

  public async findAllRaws(dto: FindAllInquiryResponsesDto): Promise<InquiryResponseBasicRawDto[]> {
    const { order, column, userId } = dto;
    const query = this.selectInquiryResponse(this.select.inquiryResponses)
      .innerJoin("inquiryResponse.InquiryRequest", "InquiryRequest")
      .innerJoin("InquiryRequest.Product", "Product")
      .orderBy(`inquiryResponse.${column}`, order)
      .where("inquiryResponse.AdminUser.id = :id", { id: userId })
      .groupBy("inquiryResponse.id");

    const inquiryResponseRaws = await query.getRawMany();

    return inquiryResponseRaws.map((inquiryResponse) => ({
      inquiryResponse: {
        id: inquiryResponse.inquiryResponseId,
        title: inquiryResponse.inquiryResponseTitle,
        createdAt: inquiryResponse.inquiryResponseCreatedAt,
      },
      product: {
        id: inquiryResponse.productId,
        name: inquiryResponse.productName,
        price: inquiryResponse.productPrice,
        category: inquiryResponse.productCategory,
      },
    }));
  }

  public async findDetailRaw(id: string): Promise<InquiryResponseDetailRawDto> {
    const inquiryResponse = await this.selectInquiryResponse(this.select.inquiryResponse)
      .leftJoin("inquiryResponse.InquiryResponseImage", "InquiryResponseImage")
      .leftJoin("inquiryResponse.InquiryResponseVideo", "InquiryResponseVideo")
      .innerJoin("inquiryResponse.InquiryRequest", "InquiryRequest")
      .leftJoin("InquiryRequest.InquiryRequestImage", "InquiryRequestImage")
      .leftJoin("InquiryRequest.InquiryRequestVideo", "InquiryRequestVideo")
      .innerJoin("InquiryRequest.Product", "Product")
      .where("inquiryResponse.id = :id", { id })
      .getOne();

    return {
      inquiryResponse: {
        id: inquiryResponse.id,
        title: inquiryResponse.title,
        content: inquiryResponse.content,
        imageUrls: inquiryResponse.InquiryResponseImage.map((image) => image.url),
        videoUrls: inquiryResponse.InquiryResponseVideo.map((video) => video.url),
      },
      inquiryRequest: {
        id: inquiryResponse.InquiryRequest.id,
        title: inquiryResponse.InquiryRequest.title,
        content: inquiryResponse.InquiryRequest.content,
        option: inquiryResponse.InquiryRequest.inquiryOption,
        isAnswered: Boolean(inquiryResponse.InquiryRequest.isAnswered),
        imageUrls: inquiryResponse.InquiryRequest.InquiryRequestImage.map((image) => image.url),
        videoUrls: inquiryResponse.InquiryRequest.InquiryRequestVideo.map((video) => video.url),
      },
      product: {
        id: inquiryResponse.InquiryRequest.Product.id,
        name: inquiryResponse.InquiryRequest.Product.name,
        price: inquiryResponse.InquiryRequest.Product.price,
        category: inquiryResponse.InquiryRequest.Product.category,
      },
    };
  }
}
