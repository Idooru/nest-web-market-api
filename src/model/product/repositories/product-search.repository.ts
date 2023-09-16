import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";
import { Repository } from "typeorm";
import { ProductSelectProperty } from "src/common/config/repository-select-configs/product.select";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";

@Injectable()
export class ProductSearchRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,
    @Inject("ProductsSelectProperty")
    private readonly productSelect: ProductSelectProperty,
  ) {}

  async isInvalidProductName(name: string): Promise<boolean> {
    return !(await this.productRepository.exist({ where: { name } }));
  }

  async findAllProductsFromLatest(): Promise<ProductEntity[]> {
    return await this.productRepository
      .createQueryBuilder()
      .select(this.productSelect.products)
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
      .leftJoin("InquiryRequest.inquiryRequestWritter", "InquiryRequestWritter")
      .leftJoin("InquiryRequestWritter.User", "InquiryUser")
      .leftJoin("InquiryUser.Auth", "InquiryAuth")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequsetVideo")
      .orderBy("product.createdAt", "DESC")
      .getMany();
  }

  async findAllProductsFromOldest(): Promise<ProductEntity[]> {
    return await this.productRepository
      .createQueryBuilder()
      .select(this.productSelect.products)
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
      .leftJoin("InquiryRequest.inquiryRequestWritter", "InquiryRequestWritter")
      .leftJoin("InquiryRequestWritter.User", "InquiryUser")
      .leftJoin("InquiryUser.Auth", "InquiryAuth")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequsetVideo")
      .orderBy("product.createdAt", "ASC")
      .getMany();
  }

  async findProductWithId(id: string): Promise<ProductEntity> {
    return await this.productRepository
      .createQueryBuilder()
      .select(this.productSelect.product)
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
      .leftJoin("InquiryRequest.inquiryRequestWritter", "InquiryRequestWritter")
      .leftJoin("InquiryRequestWritter.User", "InquiryUser")
      .leftJoin("InquiryUser.Auth", "InquiryAuth")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
      .where("product.id = :id", { id })
      .getOne();
  }

  async findProductWithName(name: string): Promise<ProductEntity> {
    return await this.productRepository
      .createQueryBuilder()
      .select(this.productSelect.product)
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
      .leftJoin("InquiryRequest.inquiryRequestWritter", "InquiryRequestWritter")
      .leftJoin("InquiryRequestWritter.User", "InquiryUser")
      .leftJoin("InquiryUser.Auth", "InquiryAuth")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
      .where("product.name = :name", { name })
      .getOne();
  }

  async findProductHavingStarRate(id: string): Promise<ProductEntity> {
    return await this.productRepository
      .createQueryBuilder()
      .select(this.productSelect.productWhenNeedStarRate)
      .from(ProductEntity, "product")
      .innerJoin("product.StarRate", "StarRate")
      .where("product.id = :id", { id })
      .getOne();
  }

  async findProductImageWithUrl(url: string): Promise<ProductImageEntity> {
    return await this.productImageRepository
      .createQueryBuilder()
      .select(this.productSelect.productImages)
      .from(ProductImageEntity, "productImage")
      .where("productImage.url = :url", { url })
      .getOne();
  }
}
