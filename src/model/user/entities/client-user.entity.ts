import { CommonEntity } from "src/common/entities/common.entity";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "client_users", synchronize: true })
export class ClientUserEntity extends CommonEntity {
  @OneToOne(() => UserEntity, (user) => user.clientActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  User: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Client, {
    onDelete: "CASCADE",
  })
  purchasedProduct: ProductEntity;

  @ManyToOne(() => ReviewEntity, (review) => review.Client, {
    onDelete: "CASCADE",
  })
  writtenReview: ReviewEntity;

  @ManyToOne(() => InquiryEntity, (inquiry) => inquiry.Client, {
    onDelete: "CASCADE",
  })
  writtenInquiry: InquiryEntity;
}
