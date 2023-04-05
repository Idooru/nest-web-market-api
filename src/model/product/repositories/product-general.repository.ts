import { Injectable } from "@nestjs/common";
import { ModifyProductDto } from "../dto/modify-product.dto";
import { CreateProductDto } from "../dto/create-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { productSelectProperty } from "src/common/config/repository-select-configs/product-select";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { RepositoryErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class ProductGeneralRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly repositoryErrorHandler: RepositoryErrorHandleLibrary,
  ) {
    super();
  }

  private readonly select = productSelectProperty;

  async findProductsAllId(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productsIdSelect)
        .from(ProductEntity, "product")
        .getMany();
    } catch (err) {
      this.methodName = this.findProductsAllId.name;
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async findAllProductsFromLatest(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productsSelect)
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async findAllProductsFromOldest(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productsSelect)
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async findProductOneByName(name: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productSelect)
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
      this.methodName = this.findProductOneByName.name;
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: name, stuffMean: "이름" },
      );
    }
  }

  async findProductOneById(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productSelect)
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
      this.methodName = this.findProductOneById.name;
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
    }
  }

  async findProductOneJustNeedStarRate(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productSelectWhenNeedStarRate)
        .from(ProductEntity, "product")
        .innerJoin("product.StarRate", "StarRate")
        .where("product.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findProductOneJustNeedStarRate.name;
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
        { stuff: id, stuffMean: "아이디" },
      );
    }
  }

  async createProduct(
    createProductDto: CreateProductDto,
    admin: AdminUserEntity,
  ): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .insert()
        .into(ProductEntity)
        .values({ creater: admin, ...createProductDto })
        .execute();
    } catch (err) {
      this.methodName = this.createProduct.name;
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<ProductEntity>(
        new ProductEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
