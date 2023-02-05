import { StarRatingRepository } from "./../../review/providers/star-rating.repository";
import { ProductEntity } from "../entities/product.entity";
import { UploadRepository } from "../../upload/providers/upload.repository";
import { ProductRepository } from "./product.repository";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { MediaUrlCookie } from "src/model/upload/media.url.cookies.interface";
import { PromiseLibrary } from "src/common/lib/promise.library";

@Injectable()
export class ProductService {
  constructor(
    private readonly promiseLibrary: PromiseLibrary,
    private readonly productRepository: ProductRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly starRatingRepository: StarRatingRepository,
  ) {}

  async getProductsAllFromLatest(): Promise<ProductEntity[]> {
    return await this.productRepository.findProductsAllFromLatest();
  }

  async getProductsAllFromOldest(): Promise<ProductEntity[]> {
    return await this.productRepository.findProductsAllFromOldest();
  }

  async getProductByName(name: string): Promise<ProductEntity> {
    return await this.productRepository.findProductOneByName(name);
  }

  async getProductById(id: string): Promise<ProductEntity> {
    return await this.productRepository.findProductOneById(id);
  }

  async createProduct(
    createProductDto: CreateProductDto,
    imageCookie: MediaUrlCookie,
  ): Promise<void> {
    const { name } = createProductDto;
    const existProduct = await this.productRepository.isExistProductWithName(
      name,
    );

    if (existProduct) {
      throw new BadRequestException("해당 상품명은 사용중입니다.");
    }

    const [image, starRating] = await this.promiseLibrary.twoPromiseBundle(
      this.uploadRepository.findProductImageWithUrl(imageCookie.url),
      this.starRatingRepository.createStarRatingSample(),
      "Find product's image and star-rating",
    );

    await this.productRepository.createProduct(createProductDto);
    const product = await this.productRepository.findLastCreatedProduct();

    await this.promiseLibrary.twoPromiseBundle(
      this.uploadRepository.insertProductIdOnProductImage(image, product),
      this.starRatingRepository.insertProductIdOnStarRating(
        starRating,
        product,
      ),
      "Insert product's id for image and star-rating ",
    );
  }

  async modifyProduct(
    productId: string,
    modifyProductDto: ModifyProductDto,
    imageCookie: MediaUrlCookie,
  ): Promise<void> {
    const { name } = modifyProductDto;

    const [product, newImage, oldImage] =
      await this.promiseLibrary.threePromiseBundle(
        this.productRepository.findProductOneById(productId),
        this.uploadRepository.findProductImageWithUrl(imageCookie.url),
        this.uploadRepository.findProductImageEvenUse(productId),
        "Find Product And Image",
      );

    await this.productRepository.checkProductNameToModify(name, product.name);

    await this.promiseLibrary.threePromiseBundle(
      this.uploadRepository.deleteProductImageWithId(oldImage.id),
      this.uploadRepository.insertProductIdOnProductImage(newImage, product),
      this.productRepository.modifyProduct(productId, modifyProductDto),
      "Replace Image And Modify Product",
    );
  }

  async removeProduct(id: string): Promise<void> {
    const existProduct = await this.productRepository.isExistProductWithId(id);

    if (!existProduct) {
      throw new NotFoundException("해당 아이디의 상품을 찾을 수 없습니다.");
    }

    await this.productRepository.removeProduct(id);
  }
}
