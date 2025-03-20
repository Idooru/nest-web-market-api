import { ProductImageEntity } from "../../../media/entities/product-image.entity";
import { AdminUserEntity } from "../../../user/entities/admin-user.entity";
import { ProductBody } from "./product-body.dto";

export class SearchCreateProductDto {
  body: ProductBody;
  admin: AdminUserEntity;
  productImages: ProductImageEntity[];
}
