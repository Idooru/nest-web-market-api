import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserSearcher } from "../../../user/logic/user.searcher";
import { CreateProductDto } from "../../dto/request/create-product.dto";
import { SearchCreateProductDto } from "../../dto/request/search-create-product.dto";
import { ModifyProductDto } from "../../dto/request/modify-product.dto";
import { SearchModifyProductDto } from "../../dto/request/search-modify-product.dto";
import { ModifyProductImageDto } from "../../dto/request/modify-product-image.dto";
import { SearchModifyProductImageDto } from "../../dto/request/search-modify-product-image.dto";
import { loggerFactory } from "../../../../common/functions/logger.factory";
import { AdminUserEntity } from "../../../user/entities/admin-user.entity";
import { UserEntity } from "../../../user/entities/user.entity";
import { ProductImageSearcher } from "../../../media/logic/product-image.searcher";
import { ProductImageEntity } from "../../../media/entities/product-image.entity";
import { MediaCookieDto } from "../../../media/dto/request/media-cookie.dto";

class EntityFinder {
  constructor(
    private readonly userIdFilter: string,
    private readonly userSearcher: UserSearcher,
    private readonly productImageSearcher: ProductImageSearcher,
  ) {}

  public findBeforeProductImages(productId: string): Promise<ProductImageEntity[]> {
    return this.productImageSearcher.findEntity({
      property: "productImage.productId = :productId",
      alias: { productId },
      getOne: false,
    }) as Promise<ProductImageEntity[]>;
  }

  public findProductImages(imageCookies: MediaCookieDto[], property: string): Promise<ProductImageEntity[]> {
    return Promise.all(
      imageCookies.map(
        (imgCookie) =>
          this.productImageSearcher.findEntity({
            property,
            alias: { id: imgCookie.id },
            getOne: true,
          }) as Promise<ProductImageEntity>,
      ),
    );
  }

  public findUser(userId: string): Promise<UserEntity> {
    return this.userSearcher.findEntity({
      property: this.userIdFilter,
      alias: { id: userId },
      getOne: true,
      entities: [AdminUserEntity],
    }) as Promise<UserEntity>;
  }
}

@Injectable()
export class ProductTransactionSearcher {
  public entityFinder: EntityFinder;

  constructor(
    @Inject("user-id-filter")
    protected readonly userIdFilter: string,
    protected readonly userSearcher: UserSearcher,
    protected readonly productImageSearcher: ProductImageSearcher,
  ) {
    this.entityFinder = new EntityFinder(this.userIdFilter, this.userSearcher, this.productImageSearcher);
  }

  private async getProductImagesBeforeModify(productImgCookies: MediaCookieDto[], productId: string) {
    const [beforeProductImages, newProductImages] = await Promise.all([
      this.entityFinder.findBeforeProductImages(productId),
      this.entityFinder.findProductImages(productImgCookies, "product.id = :id"),
    ]);

    return { beforeProductImages, newProductImages };
  }

  public async searchCreateProduct(dto: CreateProductDto): Promise<SearchCreateProductDto> {
    const { body, userId, productImgCookies } = dto;

    const [user, productImages] = await Promise.all([
      this.entityFinder.findUser(userId),
      this.entityFinder.findProductImages(productImgCookies, "productImage.id = :id"),
    ]);

    return {
      body,
      admin: user.AdminUser,
      productImages,
    };
  }

  public async searchModifyProduct(dto: ModifyProductDto): Promise<SearchModifyProductDto> {
    const { productId, body, productImgCookies } = dto;

    if (!productImgCookies.length) {
      return { productId, body };
    }

    return { productId, body, ...(await this.getProductImagesBeforeModify(productImgCookies, productId)) };
  }

  async searchModifyProductImage(dto: ModifyProductImageDto): Promise<SearchModifyProductImageDto> {
    const { productId, productImgCookies } = dto;

    if (!productImgCookies.length) {
      const message = "업로드된 상품 이미지가 존재하지 않습니다. 상품 이미지를 먼저 업로드 해주세요.";
      loggerFactory("None Exist").error(message);
      throw new NotFoundException(message);
    }

    return { productId, ...(await this.getProductImagesBeforeModify(productImgCookies, productId)) };
  }
}
