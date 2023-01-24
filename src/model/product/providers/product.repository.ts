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

  async checkProductNameToCreate(name: string): Promise<void> {
    const found = await this.productRepository
      .createQueryBuilder("product")
      .where("product.name = :name", { name })
      .getOne();

    if (!found) {
      return;
    }

    throw new BadRequestException("해당 상품명은 사용중입니다.");
  }

  async checkProductNameToModify(
    replaceName: string,
    originalName: string,
  ): Promise<void> {
    const found = await this.productRepository
      .createQueryBuilder("product")
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

  async checkProductIdToExist(id: string): Promise<void> {
    const found = await this.productRepository
      .createQueryBuilder("product")
      .where("product.id = :id", { id })
      .getOne();

    if (!found) {
      throw new BadRequestException("해당 상품 아이디는 존재하지 않습니다.");
    }
  }

  async findProductsAllFromLatest(): Promise<ProductEntity[]> {
    const found = await this.productRepository
      .createQueryBuilder("product")
      .leftJoin("product.Image", "Image")
      .leftJoin("product.StarRating", "StarRating")
      .leftJoin("product.Review", "Review")
      .leftJoin("Review.UserActivity", "UserActivity")
      .leftJoin("product.Inquiry", "Inquiry")
      .select(this.select.productsSelect)
      .orderBy("product.createdAt", "DESC")
      .getMany();

    if (!found.length) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
    }
    return found;
  }

  async findProductsAllFromOldest(): Promise<ProductEntity[]> {
    const found = await this.productRepository
      .createQueryBuilder("product")
      .leftJoin("product.Image", "Image")
      .leftJoin("product.StarRating", "StarRating")
      .leftJoin("product.Review", "Review")
      .leftJoin("Review.UserActivity", "UserActivity")
      .leftJoin("product.Inquiry", "Inquiry")
      .select(this.select.productsSelect)
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
        .createQueryBuilder("product")
        .leftJoin("product.Image", "Image")
        .leftJoin("product.StarRating", "StarRating")
        .leftJoin("product.Review", "Review")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Review.UserActivity", "UserActivity")
        .leftJoin("product.Inquiry", "Inquiry")
        .select(this.select.productSelect)
        .where("product.name = :name", { name })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 상품이름은 존재하지 않습니다.");
    }
  }

  async findProductOneById(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder("product")
        .leftJoin("product.Image", "Image")
        .leftJoin("product.StarRating", "StarRating")
        .leftJoin("product.Review", "Review")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Review.UserActivity", "UserActivity")
        .leftJoin("product.Inquiry", "Inquiry")
        .select(this.select.productSelect)
        .where("product.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 상품 아이디는 존재하지 않습니다.");
    }
  }

  async findProductWhenUseStarRatingWithId(id: string): Promise<ProductEntity> {
    try {
      return await this.productRepository
        .createQueryBuilder("product")
        .leftJoin("product.Image", "Image")
        .leftJoin("product.StarRating", "StarRating")
        .select(this.select.productSelectWithStarRating)
        .where("product.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      throw new NotFoundException("해당 상품 아이디는 존재하지 않습니다.");
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    // 엑티브 레코드 패턴
    const product = this.productRepository.create();
    product.name = createProductDto.name;
    product.price = createProductDto.price;
    product.origin = createProductDto.origin;
    product.type = createProductDto.type;
    product.description = createProductDto.description;
    product.Image = createProductDto.Image;
    product.StarRating = createProductDto.StarRating;
    await this.productRepository.save(product);

    // 리파지토리 패턴
    // await this.productRepository
    //   .createQueryBuilder("product")
    //   .insert()
    //   .into(ProductEntity)
    //   .values({ ...createProductDto })
    //   .execute();
  }

  async modifyProduct(
    productId: string,
    modifyProductDto: ModifyProductDto,
  ): Promise<void> {
    // 엑티브 레코드 패턴
    const product = await this.findProductOneById(productId);
    product.name = modifyProductDto.name;
    product.price = modifyProductDto.price;
    product.origin = modifyProductDto.origin;
    product.type = modifyProductDto.type;
    product.description = modifyProductDto.description;
    product.Image = modifyProductDto.Image;
    product.quantity = modifyProductDto.quantity;
    await this.productRepository.save(product);

    // 리파지토리 패턴
    // await this.productRepository
    //   .createQueryBuilder("product")
    //   .update(ProductEntity)
    //   .set({ ...modifyProductDto })
    //   .where("product.id = :id", { id: productId })
    //   .execute();
  }

  async removeProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
