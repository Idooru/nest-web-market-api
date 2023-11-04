import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChildEntity } from "src/common/entities/child.entity";

@Entity({ name: "client_users", synchronize: true })
export class ClientUserEntity extends ChildEntity {
  @OneToOne(() => UserEntity, (user) => user.clientActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id" })
  User: UserEntity;

  @OneToMany(() => ProductEntity, (product) => product.purchaser)
  purchasedProduct: ProductEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.reviewer)
  writtenReview: ReviewEntity[];

  @OneToMany(
    () => InquiryRequestEntity,
    (inquiryRequest) => inquiryRequest.inquiryRequestWritter,
    { cascade: true },
  )
  writtenInquiryRequest: InquiryRequestEntity[];
}
