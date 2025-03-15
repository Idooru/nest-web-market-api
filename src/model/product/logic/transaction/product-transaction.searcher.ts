import { Injectable, NotFoundException } from "@nestjs/common";
import { UserSearcher } from "../../../user/logic/user.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { CreateProductDto } from "../../dto/create-product.dto";
import { SearchCreateProductDto } from "../../dto/search-create-product.dto";
import { ModifyProductDto } from "../../dto/modify-product.dto";
import { SearchModifyProductDto } from "../../dto/search-modify-product.dto";
import { ModifyProductImageDto } from "../../dto/modify-product-image.dto";
import { SearchModifyProductImageDto } from "../../dto/search-modify-product-image.dto";
import { loggerFactory } from "../../../../common/functions/logger.factory";
import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";

@Injectable()
export class ProductTransactionSearcher {
  constructor(private readonly userSearcher: UserSearcher, private readonly mediaSearcher: MediaSearcher) {}

  private validateProductImageCookies(cookies: MediaCookieDto[]): void {
    if (!cookies.length) {
      const message = "업로드된 상품 이미지가 존재하지 않습니다. 상품 이미지를 먼저 업로드 해주세요.";
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }
  }

  public async searchCreateProduct(dto: CreateProductDto): Promise<SearchCreateProductDto> {
    const { body, userId, productImgCookies } = dto;

    this.validateProductImageCookies(productImgCookies);

    const [admin, productImages] = await Promise.all([
      this.userSearcher.findAdminUserObjectWithId(userId),
      this.mediaSearcher.findProductImageWithId(productImgCookies),
    ]);

    return {
      body,
      admin,
      productImages,
    };
  }

  public async searchModifyProduct(dto: ModifyProductDto): Promise<SearchModifyProductDto> {
    const { productId, body, productImgCookies } = dto;

    if (!productImgCookies.length) {
      return { productId, body };
    }

    const [beforeProductImages, newProductImages] = await Promise.all([
      this.mediaSearcher.findBeforeProductImages(productId),
      this.mediaSearcher.findProductImageWithId(productImgCookies),
    ]);

    return { productId, body, beforeProductImages, newProductImages };
  }

  async searchModifyProductImage(dto: ModifyProductImageDto): Promise<SearchModifyProductImageDto> {
    const { productId, productImgCookies } = dto;

    this.validateProductImageCookies(productImgCookies);

    const [beforeProductImages, newProductImages] = await Promise.all([
      this.mediaSearcher.findBeforeProductImages(productId),
      this.mediaSearcher.findProductImageWithId(productImgCookies),
    ]);

    return { productId, beforeProductImages, newProductImages };
  }
}
