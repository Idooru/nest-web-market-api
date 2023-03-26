import { CommonEntity } from "src/common/entities/common.entity";
import { RequestInquiryEntity } from "src/model/inquiry/entities/request-inquiry.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "client_users", synchronize: true })
export class ClientUserEntity extends CommonEntity {
  @OneToOne(() => UserEntity, (user) => user.clientActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UserEntity;

  @OneToMany(() => ProductEntity, (product) => product.purchaser)
  purchasedProduct: ProductEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.reviewer)
  writtenReview: ReviewEntity[];

  @OneToMany(() => RequestInquiryEntity, (inquiry) => inquiry.inquirer)
  writtenInquiry: RequestInquiryEntity[];
}
