import { Entity, OneToOne, ManyToOne, Column, JoinColumn } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { UserEntity } from "src/model/user/entities/user.entity";

@Entity({ name: "products_images", synchronize: true })
export class ProductImageEntity extends CommonEntity {
  @OneToOne(() => ProductEntity, (product) => product.Image, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  Product: ProductEntity;

  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "uploaderId" })
  uploader: UserEntity;
}
