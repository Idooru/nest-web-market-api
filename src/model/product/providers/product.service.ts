import { StarRatingRepository } from "./../../review/providers/star-rating.repository";
import { ProductEntity } from "../entities/product.entity";
import { PromisesLibrary } from "../../../common/lib/promises.library";
import { UploadRepository } from "../../upload/providers/upload.repository";
import { ProductRepository } from "./product.repository";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "../dto/create_product.dto";
import { ModifyProductDto } from "../dto/modify_product.dto";
import { MediaUrlCookie } from "src/common/interfaces/media.url.cookie.interface";

@Injectable()
export class ProductService {
  constructor(
    private readonly promisesLibrary: PromisesLibrary,
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

    const findImageAndStarRating = await Promise.allSettled([
      this.uploadRepository.findProductImageWithUrl(imageCookie.url),
      this.starRatingRepository.createStarRatingSample(),
    ]);

    const [image, starRating] = this.promisesLibrary.twoPromiseSettled(
      findImageAndStarRating[0],
      findImageAndStarRating[1],
      "Find Image And StarRating",
    );

    await this.productRepository.createProduct(createProductDto);
    const product = await this.productRepository.findLastCreatedProduct();
    await this.uploadRepository.insertProductIdOnProductImage(image, product);
    await this.starRatingRepository.insertProductIdOnStarRating(
      starRating,
      product,
    );
  }

  async modifyProduct(
    productId: string,
    modifyProductDto: ModifyProductDto,
    imageCookie: MediaUrlCookie,
  ): Promise<void> {
    const { name } = modifyProductDto;
    const findProductAndImage = await Promise.allSettled([
      this.productRepository.findProductOneById(productId),
      this.uploadRepository.findProductImageWithUrl(imageCookie.url),
    ]);

    const [product, image] = this.promisesLibrary.twoPromiseSettled(
      findProductAndImage[0],
      findProductAndImage[1],
      "Find Product And ImageId",
    );

    await this.productRepository.checkProductNameToModify(name, product.name);
    const getImage = await this.uploadRepository.findProductImageWithUrl(
      image.url,
    );

    modifyProductDto.Image = getImage;

    const beforeImage =
      await this.uploadRepository.findProductImageWithProductId(product.id);
    await this.uploadRepository.deleteProductImageWithId(beforeImage.id);

    await this.productRepository.modifyProduct(productId, modifyProductDto);
  }

  async removeProduct(id: string): Promise<void> {
    const existProduct = await this.productRepository.isExistProductWithId(id);

    if (!existProduct) {
      throw new NotFoundException("해당 아이디의 상품을 찾을 수 없습니다.");
    }

    await this.productRepository.removeProduct(id);
  }
}
