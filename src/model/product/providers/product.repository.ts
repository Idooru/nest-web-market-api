import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { CreateProductDto } from "../dto/create_product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { productSelectProperty } from "src/common/config/repository-select-configs/product-select";

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  private readonly select = productSelectProperty;

  async isExistProductWithName(name: string): Promise<boolean> {
    return (await this.productRepository.findOne({ where: { name } }))
      ? true
      : false;
  }

  async isExistProductWithId(id: string): Promise<boolean> {
    return (await this.productRepository.findOne({ where: { id } }))
      ? true
      : false;
  }

  async checkProductNameToModify(
    replaceName: string,
    originalName: string,
  ): Promise<void> {
    const found = await this.productRepository
      .createQueryBuilder()
      .select("product")
      .from(ProductEntity, "product")
      .where("product.name = :name", { name: replaceName })
      .getOne();

    /* 바꿀 이름으로 찾은게 없거나 바꿔야 할 상품의 이름과 바꿀 이름이 동일 하다면 리턴함
      그 이외의 경우는 DB에 저장된 상품의 이름으로 바꾸게 되는 경우 이므로 에러를 던짐*/
    if (!found || found.name === originalName) {
      return;
    } else {
      throw new BadRequestException("해당 상품명은 사용중입니다.");
    }
  }

  async findProductsAllFromLatest(): Promise<ProductEntity[]> {
    const found = await this.productRepository
      .createQueryBuilder()
      .select(this.select.productsSelect)
      .from(ProductEntity, "product")
      .innerJoin("product.Image", "Image")
      .innerJoin("product.StarRating", "StarRating")
      .leftJoin("product.Review", "Review")
      .leftJoin("product.Inquiry", "Inquiry")
      .leftJoin("Review.Image", "ReviewImage")
      .leftJoin("Review.Video", "ReviewVideo")
      .leftJoin("Review.UserActivity", "UserActivity")
      .leftJoin("UserActivity.User", "User")
      .orderBy("product.createdAt", "DESC")
      .getMany();

    if (!found.length) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
    }
    return found;
  }

  async findProductsAllFromOldest(): Promise<ProductEntity[]> {
    const found = await this.productRepository
      .createQueryBuilder()
      .select(this.select.productsSelect)
      .from(ProductEntity, "product")
      .innerJoin("product.Image", "Image")
      .innerJoin("product.StarRating", "StarRating")
      .leftJoin("product.Review", "Review")
      .leftJoin("product.Inquiry", "Inquiry")
      .leftJoin("Review.Image", "ReviewImage")
      .leftJoin("Review.Video", "ReviewVideo")
      .leftJoin("Review.UserActivity", "UserActivity")
      .leftJoin("UserActivity.User", "User")
      .orderBy("product.createdAt", "ASC")
      .getMany();

    if (!found.length) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
    }
    return found;
  }

  async findProductOneByName(name: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productSelect)
        .from(ProductEntity, "product")
        .innerJoin("product.Image", "Image")
        .innerJoin("product.StarRating", "StarRating")
        .leftJoin("product.Review", "Review")
        .leftJoin("product.Inquiry", "Inquiry")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Review.UserActivity", "UserActivity")
        .where("product.name = :name", { name })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 상품이름은 존재하지 않습니다.");
    }
  }

  async findProductOneById(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productSelect)
        .from(ProductEntity, "product")
        .innerJoin("product.Image", "Image")
        .innerJoin("product.StarRating", "StarRating")
        .leftJoin("product.Review", "Review")
        .leftJoin("product.Inquiry", "Inquiry")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Review.UserActivity", "UserActivity")
        .where("product.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 상품 아이디는 존재하지 않습니다.");
    }
  }

  async findProductWhenUseStarRatingWithId(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder()
        .select(this.select.productSelectWithStarRating)
        .from(ProductEntity, "product")
        .innerJoin("product.Image", "Image")
        .innerJoin("product.StarRating", "StarRating")
        .where("product.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 상품 아이디는 존재하지 않습니다.");
    }
  }

  // 웬만해선 상품 생성 서비스 로직에서만 호출하도록 한다.
  async findLastCreatedProduct(): Promise<ProductEntity> {
    return await this.productRepository
      .createQueryBuilder()
      .select("product")
      .from(ProductEntity, "product")
      .orderBy("product.createdAt", "DESC")
      .limit(1)
      .getOne();
  }

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(ProductEntity)
      .values({ ...createProductDto })
      .execute();
  }

  async modifyProduct(
    productId: string,
    modifyProductDto: ModifyProductDto,
  ): Promise<void> {
    await this.productRepository
      .createQueryBuilder()
      .update(ProductEntity)
      .set({ ...modifyProductDto })
      .where("id = :id", { id: productId })
      .execute();
  }

  async removeProduct(productId: string): Promise<void> {
    await this.productRepository
      .createQueryBuilder()
      .delete()
      .from(ProductEntity)
      .where("id = :id", { id: productId })
      .execute();
  }
}
