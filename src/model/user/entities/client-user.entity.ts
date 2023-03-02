import { UserPrototypeEntity } from "src/common/entities/user-prototype.entity";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { Entity, OneToMany } from "typeorm";

@Entity({ name: "client-users", synchronize: true })
export class ClientUserEntity extends UserPrototypeEntity {
  @OneToMany(() => ReviewEntity, (review) => review.ClientUser)
  Review: ReviewEntity[]; // 고객 사용자가 리뷰를 작성하였을 때

  @OneToMany(() => ProductEntity, (product) => product.ClientUser)
  Product: ProductEntity[]; // 고객 사용자가 상품을 구매했을 때

  @OneToMany(() => InquiryEntity, (inquiry) => inquiry.ClientUser)
  Inquiry: InquiryEntity[]; // 고객 사용자가 문의를 작성하였을 때
}
