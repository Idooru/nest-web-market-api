import { Injectable } from "@nestjs/common";
import { ProductSearcher } from "../product.searcher";
import { UserSearcher } from "../../../user/logic/user.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { CreateProductDto } from "../../dto/create-product-dto";
import { SearchCreateProductDto } from "../../dto/search-create-product.dto";
import { ModifyProductDto } from "../../dto/modify-product.dto";
import { SearchModifyProductDto } from "../../dto/search-modify-product.dto";
import { ModifyProductImageDto } from "../../dto/modify-product-image.dto";
import { SearchModifyProductImageDto } from "../../dto/search-modify-product-image.dto";

@Injectable()
export class ProductTransactionSearcher {
  constructor(
    private readonly productSearcher: ProductSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly mediaSearcher: MediaSearcher,
  ) {}

  public async searchCreateProduct(dto: CreateProductDto): Promise<SearchCreateProductDto> {
    const { productBodyDto, userId, productImgCookies } = dto;

    const [admin, productImages] = await Promise.all([
      this.userSearcher.findAdminUserObjectWithId(userId),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    return {
      productBodyDto,
      admin,
      productImages,
    };
  }

  public async searchModifyProduct(dto: ModifyProductDto): Promise<SearchModifyProductDto> {
    const { id, productBodyDto, productImgCookies } = dto;

    const [product, beforeProductImages, newProductImages] = await Promise.all([
      this.productSearcher.findProductWithId(id),
      this.mediaSearcher.findBeforeProductImagesWithId(id),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    return { product, productBodyDto, beforeProductImages, newProductImages };
  }

  public async searchModifyProductImage(dto: ModifyProductImageDto): Promise<SearchModifyProductImageDto> {
    const { id, productImgCookies } = dto;

    const [product, beforeProductImages, newProductImages] = await Promise.all([
      this.productSearcher.findProductWithId(id),
      this.mediaSearcher.findBeforeProductImagesWithId(id),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    return { product, beforeProductImages, newProductImages };
  }
}
