import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { ProductSelect } from "src/common/config/repository-select-configs/product.select";
import { loggerFactory } from "../../../common/functions/logger.factory";

@Injectable()
export class ProductSearchRepository {
  constructor(
    @Inject("product-select")
    private readonly select: ProductSelect,
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  private setManyProduct(): SelectQueryBuilder<ProductEntity> {
    return this.repository
      .createQueryBuilder()
      .select(this.select.products)
      .from(ProductEntity, "product")
      .innerJoin("product.Image", "Image")
      .innerJoin("product.StarRate", "StarRate")
      .leftJoin("product.Review", "Review")
      .groupBy("product.id");
  }

  public async findAllProducts(column: string, order: "ASC" | "DESC"): Promise<ProductEntity[]> {
    const products = await this.setManyProduct().orderBy(column, order).getRawMany();

    if (!products.length) {
      const message = "전체 상품을 찾을수가 없습니다.";
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }

    return products;
  }

  public findProductWithId(id: string): Promise<ProductEntity> {
    return this.repository
      .createQueryBuilder()
      .select(this.select.product)
      .from(ProductEntity, "product")
      .innerJoin("product.Image", "Image")
      .innerJoin("product.StarRate", "StarRate")
      .leftJoin("product.Review", "Review")
      .leftJoin("Review.reviewer", "Reviewer")
      .leftJoin("Reviewer.User", "ReviewUser")
      .leftJoin("ReviewUser.Auth", "ReviewAuth")
      .leftJoin("Review.Image", "ReviewImage")
      .leftJoin("Review.Video", "ReviewVideo")
      .leftJoin("product.InquiryRequest", "InquiryRequest")
      .leftJoin("InquiryRequest.InquiryRequester", "InquiryRequester")
      .leftJoin("InquiryRequester.User", "InquiryUser")
      .leftJoin("InquiryUser.Auth", "InquiryAuth")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
      .where("product.id = :id", { id })
      .getOne();
  }

  public async findProductWithName(name: string): Promise<ProductEntity[]> {
    const products = await this.setManyProduct()
      .where("product.name like :name", { name: `%${name}%` })
      .getRawMany();

    if (!products.length) {
      const message = `상품이름(${name})으로 검색을 시도하였으나 결과가 없습니다.`;
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }

    return products;
  }
}
