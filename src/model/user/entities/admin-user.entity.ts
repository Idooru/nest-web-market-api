import { CommonEntity } from "src/common/entities/common.entity";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "admin_users", synchronize: true })
export class AdminUserEntity extends CommonEntity {
  @OneToOne(() => UserEntity, (user) => user.adminActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.creater)
  createdProduct: ProductEntity;

  @ManyToOne(() => InquiryEntity, (inquiry) => inquiry.Admin)
  receivedInquiry: InquiryEntity;
}
