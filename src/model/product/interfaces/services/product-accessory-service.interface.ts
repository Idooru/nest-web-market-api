import { MediaDto } from "src/model/media/dto/media.dto";
import { ProductEntity } from "../../entities/product.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";

export interface IProductAccessoryService {
  isExistProducts(founds: ProductEntity[]): void;
  findProductAndImageForModify(
    id: string,
    imageCookie: MediaDto,
  ): Promise<[ProductEntity, ProductImageEntity, ProductImageEntity]>;
}
