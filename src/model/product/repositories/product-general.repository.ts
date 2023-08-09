import { Inject, Injectable } from "@nestjs/common";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { ProductSelectProperty } from "src/common/config/repository-select-configs/product.select";
import { TypeOrmErrorHandlingBuilder } from "src/common/lib/error-handler/typeorm-error-handling.builder";
import { IProductGeneralRepository } from "../interfaces/repositories/product-general-repository.interface";
import { ProductErrorHandler } from "../error/product-error.handler";
import { ProductCategory } from "../types/product-category.type";
import { CreateProductDao } from "../dto/create-product-dto";

@Injectable()
export class ProductGeneralRepository
  extends ErrorHandlerProps
  implements IProductGeneralRepository
{
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @Inject("ProductsSelectProperty")
    private readonly select: ProductSelectProperty,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlingBuilder,
  ) {
    super();
  }

  async findAllProductsFromLatest(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.products)
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
        .leftJoin(
          "InquiryRequest.inquiryRequestWritter",
          "InquiryRequestWritter",
        )
        .leftJoin("InquiryRequestWritter.User", "InquiryUser")
        .leftJoin("InquiryUser.Auth", "InquiryAuth")
        .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
        .leftJoin("InquiryRequest.Video", "InquiryRequsetVideo")
        .orderBy("product.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.methodName = this.findAllProductsFromLatest.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async findAllProductsFromOldest(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.products)
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
        .leftJoin(
          "InquiryRequest.inquiryRequestWritter",
          "InquiryRequestWritter",
        )
        .leftJoin("InquiryRequestWritter.User", "InquiryUser")
        .leftJoin("InquiryUser.Auth", "InquiryAuth")
        .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
        .leftJoin("InquiryRequest.Video", "InquiryRequsetVideo")
        .orderBy("product.createdAt", "ASC")
        .getMany();
    } catch (err) {
      this.methodName = this.findAllProductsFromOldest.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async findOneProductByName(name: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
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
        .leftJoin(
          "InquiryRequest.inquiryRequestWritter",
          "InquiryRequestWritter",
        )
        .leftJoin("InquiryRequestWritter.User", "InquiryUser")
        .leftJoin("InquiryUser.Auth", "InquiryAuth")
        .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
        .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
        .where("product.name = :name", { name })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findOneProductByName.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(name, "name")
        .handle();
    }
  }

  async findOneProductById(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
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
        .leftJoin(
          "InquiryRequest.inquiryRequestWritter",
          "InquiryRequestWritter",
        )
        .leftJoin("InquiryRequestWritter.User", "InquiryUser")
        .leftJoin("InquiryUser.Auth", "InquiryAuth")
        .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
        .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
        .where("product.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findOneProductById.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .handle();
    }
  }

  async findProductOneJustNeedStarRate(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productWhenNeedStarRate)
        .from(ProductEntity, "product")
        .innerJoin("product.StarRate", "StarRate")
        .where("product.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findProductOneJustNeedStarRate.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .handle();
    }
  }

  async createProduct(
    createProductDao: CreateProductDao,
  ): Promise<InsertResult> {
    const { productDto, admin } = createProductDao;

    try {
      return await this.productRepository
        .createQueryBuilder()
        .insert()
        .into(ProductEntity)
        .values({ ...productDto, creater: admin })
        .execute();
    } catch (err) {
      this.methodName = this.createProduct.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyProduct(modifyProductDto: ModifyProductDto): Promise<void> {
    const {
      id,
      productDto,
      productDto: { price, quantity },
    } = modifyProductDto;

    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ ...productDto })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyProduct.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(String(price), "price")
        .setStuffs(String(quantity), "quantity")
        .handle();
    }
  }

  async modifyProductName(id: string, name: string): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ name })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyProductName.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyProductPrice(id: string, price: number): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ price: +price })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyProductPrice.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(price.toString(), "price")
        .handle();
    }
  }

  async modifyProductOrigin(id: string, origin: string): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ origin })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyProductOrigin.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyProductCategory(
    id: string,
    category: ProductCategory,
  ): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ category })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyProductCategory.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyProductDescription(
    id: string,
    description: string,
  ): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ description })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyProductDescription.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyProductQuantity(id: string, quantity: number): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ quantity: +quantity })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyProductQuantity.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(quantity.toString(), "quantity")
        .handle();
    }
  }

  async removeProduct(id: string): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .delete()
        .from(ProductEntity)
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.removeProduct.name;
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(ProductErrorHandler)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
