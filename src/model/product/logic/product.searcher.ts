import { Injectable } from "@nestjs/common";
import { ProductSearchRepository } from "../repositories/product-search.repository";
import { ValidateLibrary } from "src/common/lib/util/validate.library";
import { ProductEntity } from "../entities/product.entity";
import { MediaDto } from "../../media/dto/media.dto";
import { ProductImageEntity } from "../../media/entities/product-image.entity";

@Injectable()
export class ProductSearcher {
  constructor(
    private readonly productSearchRepository: ProductSearchRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  async findAllProductsFromLatest(): Promise<ProductEntity[]> {
    const products =
      await this.productSearchRepository.findAllProductsFromLatest();
    this.validateLibrary.isExistArray(products);
    return products;
  }

  async findAllProductsFromOldest(): Promise<ProductEntity[]> {
    const products =
      await this.productSearchRepository.findAllProductsFromOldest();
    this.validateLibrary.isExistArray(products);
    return products;
  }

  async findProductWithId(id: string): Promise<ProductEntity> {
    const product = await this.productSearchRepository.findProductWithId(id);
    this.validateLibrary.isExistData(product);
    return product;
  }

  async findProductWithName(name: string): Promise<ProductEntity> {
    const product = await this.productSearchRepository.findProductWithName(
      name,
    );
    this.validateLibrary.isExistData(product);
    return product;
  }

  async findProductHavingStarRate(id: string): Promise<ProductEntity> {
    const product =
      await this.productSearchRepository.findProductHavingStarRate(id);
    this.validateLibrary.isExistData(product);
    return product;
  }

  async findProductImagesWithUrl(
    productImgCookies: MediaDto[],
  ): Promise<ProductImageEntity[]> {
    const findWork = productImgCookies.map(async (productImgCookie) => {
      return await this.productSearchRepository.findProductImageWithUrl(
        productImgCookie.url,
      );
    });

    const productImages = await Promise.all(findWork);
    this.validateLibrary.isExistArray(productImages);
    return productImages;
  }
}
