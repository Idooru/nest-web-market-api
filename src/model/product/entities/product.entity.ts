import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { IsEnum, IsNotEmpty, IsPositive, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { StarRateEntity } from "../../review/entities/star-rate.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";
import { InquiryRequestEntity } from "../../inquiry/entities/inquiry-request.entity";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import {
  ProductCategory,
  productCategory,
} from "../types/product-category.type";
import { CartEntity } from "../../cart/entities/cart.entity";
import { PayEntity } from "../../pay/entities/pay.entity";

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

  @IsEnum(productCategory)
  @IsString()
  @IsNotEmpty()
  @Column({ type: "enum", enum: productCategory })
  category: ProductCategory;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: true })
  description: string;

  @IsPositive()
  @Column({ type: "int", unsigned: true, default: 100 })
  quantity: number;

  @OneToOne(() => StarRateEntity, (starRate) => starRate.Product, {
    cascade: true,
  })
  StarRate: StarRateEntity;

  @OneToMany(() => ProductImageEntity, (image) => image.Product, {
    cascade: true,
  })
  Image: ProductImageEntity[];

  @ManyToOne(() => AdminUserEntity, (admin) => admin.createdProduct, {
    onDelete: "CASCADE",
  })
  creater: AdminUserEntity;

  @OneToMany(() => CartEntity, (cart) => cart.Product)
  Cart: CartEntity[];

  @OneToMany(() => PayEntity, (pay) => pay.Product)
  Pay: PayEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.Product, { cascade: true })
  Review: ReviewEntity[];

  @OneToMany(() => InquiryRequestEntity, (inquiry) => inquiry.Product, {
    cascade: true,
  })
  InquiryRequest: InquiryRequestEntity[];
}
