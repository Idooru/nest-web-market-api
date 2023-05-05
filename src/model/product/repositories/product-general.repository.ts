import { Inject, Injectable } from "@nestjs/common";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { CreateProductDto } from "../dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ProductSelectProperty } from "src/common/config/repository-select-configs/product.select";
import { TypeOrmErrorHandlerBuilder } from "src/common/lib/error-handler/typeorm-error-handler.builder";

@Injectable()
export class ProductGeneralRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @Inject("ProductsSelectProperty")
    private readonly select: ProductSelectProperty,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlerBuilder,
  ) {
    super();
  }

  async findProductsAllId(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productsId)
        .from(ProductEntity, "product")
        .getMany();
    } catch (err) {
      this.methodName = this.findProductsAllId.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
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
        .setEntity(ProductEntity)
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
        .setEntity(ProductEntity)
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
        .setEntity(ProductEntity)
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
        .setEntity(ProductEntity)
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
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(id, "id")
        .handle();
    }
  }

  async createProduct(
    createProductDto: CreateProductDto,
    admin: AdminUserEntity,
  ): Promise<InsertResult> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .insert()
        .into(ProductEntity)
        .values({ creater: admin, ...createProductDto })
        .execute();
    } catch (err) {
      this.methodName = this.createProduct.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyProduct(
    id: string,
    modifyProductDto: ModifyProductDto,
  ): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ ...modifyProductDto })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyProduct.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(String(modifyProductDto.price), "price")
        .setStuffs(String(modifyProductDto.quantity), "quantity")
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
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyProductPrice(id: string, price: string): Promise<void> {
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
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(price, "price")
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
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyProductType(id: string, type: string): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .update(ProductEntity)
        .set({ type })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.methodName = this.modifyProductType.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(ProductEntity)
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
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async modifyProductQuantity(id: string, quantity: string): Promise<void> {
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
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setStuffs(quantity, "quantity")
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
        .setEntity(ProductEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
