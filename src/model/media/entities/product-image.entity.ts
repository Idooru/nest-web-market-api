import { Entity, OneToOne, JoinColumn } from "typeorm";
import { ProductEntity } from "src/model/product/entities/product.entity";

import { MediaEntity } from "../../../common/entities/media.entity";
@Entity({ name: "products_images", synchronize: true })
export class ProductImageEntity extends MediaEntity {
  @OneToOne(() => ProductEntity, (product) => product.Image, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  Product: ProductEntity;
}
