import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { CreateProductDto } from "../dto/create_product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { productSelectProperty } from "src/common/config/repository-select-configs/product-select";
import { BadRequestException } from "@nestjs/common/exceptions";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { RepositoryLogger } from "src/common/classes/repository.logger";

@Injectable()
export class ProductGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {
    super("Product General");
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
        .leftJoin("product.Inquiry", "Inquiry")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .orderBy("product.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
        .leftJoin("product.Inquiry", "Inquiry")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .orderBy("product.createdAt", "ASC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("product.Inquiry", "Inquiry")
        .leftJoin("Inquiry.Image", "InquiryImage")
        .leftJoin("Inquiry.Video", "InquiryVideo")
        .where("product.name = :name", { name })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 이름(${name})의 상품을 찾을 수 없습니다.`,
        );
      }
      throw new InternalServerErrorException(err.message);
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
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("product.Inquiry", "Inquiry")
        .leftJoin("Inquiry.Image", "InquiryImage")
        .leftJoin("Inquiry.Video", "InquiryVideo")
        .where("product.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      if (err.message.includes("Could not find any entity of type")) {
        throw new NotFoundException(
          `해당 아이디(${id})의 상품을 찾을 수 없습니다.`,
        );
      }
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      if (err.message.includes("Out of range value for column")) {
        throw new BadRequestException(
          "가격 혹은 수량을 마이너스로 수정 할 수 없습니다.",
        );
      }
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      if (err.message.includes("Out of range value for column")) {
        throw new BadRequestException("가격을 마이너스로 수정 할 수 없습니다.");
      }
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
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
      this.logger.error(err);
      if (err.message.includes("Out of range value for column")) {
        throw new BadRequestException("수량을 마이너스로 수정 할 수 없습니다.");
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async removeProduct(productId: string): Promise<void> {
    try {
      await this.productRepository
        .createQueryBuilder()
        .delete()
        .from(ProductEntity)
        .where("id = :id", { id: productId })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
