import { Entity, OneToOne, ManyToOne, Column, JoinColumn } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { UserEntity } from "src/model/user/entities/user.entity";

@Entity("products_images")
export class ProductsImageEntity extends CommonEntity {
  @OneToOne(() => ProductEntity, (product) => product.Image)
  @JoinColumn({ name: "productId" })
  Product: ProductEntity;

  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "uploaderId" })
  uploader: UserEntity;
}
