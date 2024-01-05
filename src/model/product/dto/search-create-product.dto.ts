import { ProductBodyDto } from "./product-body.dto";
import { ProductImageEntity } from "../../media/entities/product-image.entity";
import { AdminUserEntity } from "../../user/entities/admin-user.entity";

export class SearchCreateProductDto {
  productBodyDto: ProductBodyDto;
  admin: AdminUserEntity;
  productImages: ProductImageEntity[];
}
