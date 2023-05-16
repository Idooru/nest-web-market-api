import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { StarRateEntity } from "../../review/entities/star-rate.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";
import { InquiryRequestEntity } from "../../inquiry/entities/inquiry-request.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";

@Entity({ name: "products", synchronize: true })
export class ProductEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  name: string;

  @IsPositive()
  @IsNotEmpty()
  @Column({ type: "int", unsigned: true, nullable: false })
  price: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, nullable: false })
  origin: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, nullable: false })
  type: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: true })
  description: string;

  @IsPositive()
  @Column({ type: "int", unsigned: true, default: 50 })
  quantity: number;

  @OneToOne(() => ProductImageEntity, (image) => image.Product, {
    cascade: true,
  })
  Image: ProductImageEntity;

  @OneToOne(() => StarRateEntity, (starRate) => starRate.Product, {
    cascade: true,
  })
  StarRate: StarRateEntity;

  @ManyToOne(() => AdminUserEntity, (admin) => admin.createdProduct)
  creater: AdminUserEntity;

  @ManyToOne(() => ClientUserEntity, (client) => client.purchasedProduct)
  purchaser: ClientUserEntity;

  @OneToMany(() => ReviewEntity, (review) => review.Product, { cascade: true })
  Review: ReviewEntity[];

  @OneToMany(() => InquiryRequestEntity, (inquiry) => inquiry.Product, {
    cascade: true,
  })
  InquiryRequest: InquiryRequestEntity[];
}
