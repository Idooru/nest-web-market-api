import { MediaDto } from "src/model/media/dto/media.dto";
import { ProductEntity } from "../../entities/product.entity";

export interface IProductFunctionService {
  getCreateStarRate(product: ProductEntity): Promise<() => void>;
  getInsertProductImage(
    productImgCookies: MediaDto[],
    product: ProductEntity,
  ): Promise<() => void>;
  getModifyProductImage(
    id: string,
    productImgCookies: MediaDto[],
  ): Promise<() => void>;
}
