import { CommonEntity } from "src/common/entities/common.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "admin_users", synchronize: true })
export class AdminUserEntity extends CommonEntity {
  @OneToOne(() => UserEntity, (user) => user.adminActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UserEntity;

  @OneToMany(() => ProductEntity, (product) => product.creater)
  createdProduct: ProductEntity;
}
