import { Entity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { ProductEntity } from "src/model/product/entities/product.entity";

import { MediaEntity } from "../../../common/entities/media.entity";
@Entity({ name: "products_images", synchronize: true })
export class ProductImageEntity extends MediaEntity {
  @ManyToOne(() => ProductEntity, (product) => product.Image, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ referencedColumnName: "id", name: "productId" })
  Product: ProductEntity;
}
