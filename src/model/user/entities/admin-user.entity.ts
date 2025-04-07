import { InquiryResponseEntity } from "src/model/inquiry/entities/inquiry-response.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";

@Entity({ name: "admin_users", synchronize: true })
export class AdminUserEntity extends ChildEntity {
  @OneToOne(() => UserEntity, (user) => user.AdminUser, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  public User: UserEntity;

  @OneToMany(() => ProductEntity, (product) => product.AdminUser, {
    cascade: true,
  })
  public Product: ProductEntity;

  @OneToMany(() => InquiryResponseEntity, (inquiryResponse) => inquiryResponse.AdminUser, {
    cascade: true,
  })
  public InquiryResponse: InquiryResponseEntity[];
}
