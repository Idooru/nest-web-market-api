import {
  FindOptionalEntityArgs,
  FindPureEntityArgs,
  SearchRepository,
} from "../../../common/interfaces/search/search.repository";
import { ProductImageEntity } from "../entities/product-image.entity";
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { MediaSelect } from "../../../common/config/repository-select-configs/media.select";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";

@Injectable()
export class ProductImageSearchRepository extends SearchRepository<
  ProductImageEntity,
  MediaCookieDto,
  MediaBasicRawDto
> {
  constructor(
    @Inject("media-select")
    private readonly select: MediaSelect,
    @InjectRepository(ProductImageEntity)
    private readonly repository: Repository<ProductImageEntity>,
  ) {
    super();
  }

  private selectProductImage(selects?: string[]): SelectQueryBuilder<ProductImageEntity> {
    const queryBuilder = this.repository.createQueryBuilder();
    if (selects && selects.length) {
      return queryBuilder.select(selects).from(ProductImageEntity, "productImage");
    }
    return queryBuilder.select("productImage").from(ProductImageEntity, "productImage");
  }

  @Implemented
  public findPureEntity(args: FindPureEntityArgs): Promise<ProductImageEntity | ProductImageEntity[]> {
    const { property, alias, getOne } = args;
    const query = this.selectProductImage().where(property, alias);
    return getOne ? query.getOne() : query.getMany();
  }

  @Implemented
  public findOptionalEntity(args: FindOptionalEntityArgs): Promise<ProductImageEntity | ProductImageEntity[]> {
    const { property, alias, entities, getOne } = args;
    let query = this.selectProductImage().where(property, alias);

    entities.forEach((entity) => {
      const entityName = entity.name.replace("Entity", "");
      if (entityName) {
        try {
          query = query.leftJoinAndSelect(`productImage.${entityName}`, entityName);
        } catch (err) {
          const message = `해당 ${entityName}Entity는 ProductImageEntity와 연관관계가 없습니다.`;
          loggerFactory("None Relation With ProductImageEntity").error(message);
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
        this.selectProductImage(this.select.productImages)
          .where("productImage.id = :id", { id: mediaCookie.id })
          .getRawOne(),
      ),
    );

    return raws.map((raw) => ({
      id: raw.productImageId,
      url: raw.productImageUrl,
      size: parseInt(raw.productImageSize),
    }));
  }
}
