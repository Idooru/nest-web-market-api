import { Entity, OneToOne, ManyToOne, Column, JoinColumn } from "typeorm";
import { CommonEntity } from "src/common/entities/common.entity";
import { ProductsEntity } from "src/model/product/entities/product.entity";
import { UsersEntity } from "src/model/user/entities/user.entity";

@Entity("products_images")
export class ProductsImageEntity extends CommonEntity {
  @OneToOne(() => ProductsEntity, (product) => product.Image)
  @JoinColumn({ name: "productId" })
  Product: ProductsEntity;

  @Column({ type: "varchar", nullable: false, unique: true })
  url: string;

  @Column({ type: "boolean", nullable: false })
  hasInherentImage: boolean;

  @ManyToOne(() => UsersEntity, (user) => user)
  @JoinColumn({ name: "uploaderId" })
  uploader: UsersEntity;
}
