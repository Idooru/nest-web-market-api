import { Repository } from "typeorm";
import { ProductEntity } from "../../entities/product.entity";
import { StarRateEntity } from "src/model/review/entities/star-rate.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";

export interface ProductRepositoryPayload {
  product: Repository<ProductEntity>;
  starRate: Repository<StarRateEntity>;
  productImage: Repository<ProductImageEntity>;
}
