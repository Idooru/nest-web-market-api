import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { StarRateEntity } from "../../review/entities/star-rate.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";
import { InquiryRequestEntity } from "../../inquiry/entities/inquiry-request.entity";
import { AdminUserEntity } from "src/model/user/entities/admin-user.entity";
import { ProductCategory, productCategory } from "../types/product-category.type";
import { CartEntity } from "../../cart/entities/cart.entity";
import { PaymentEntity } from "../../order/entities/payment.entity";
import { warnEnumMessage } from "../../../common/functions/none-enum";

@Entity({ name: "products", synchronize: true })
export class ProductEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  public name: string;

  @IsPositive()
  @IsNotEmpty()
  @Column({ type: "int", unsigned: true, nullable: false })
  public price: number;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, nullable: false })
  public origin: string;

  @IsEnum(productCategory, { message: warnEnumMessage(productCategory) })
  @IsString()
  @IsNotEmpty()
  @Column({ type: "enum", enum: productCategory })
  public category: ProductCategory;

  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: true })
  public description: string;

  @IsOptional()
  @IsPositive()
  @Column({ type: "int", unsigned: true, default: 100 })
  public stock: number;

  @OneToOne(() => StarRateEntity, (starRate) => starRate.Product, { cascade: true })
  public StarRate: StarRateEntity;

  @OneToMany(() => ProductImageEntity, (image) => image.Product, { cascade: true })
  public ProductImage: ProductImageEntity[];

  @ManyToOne(() => AdminUserEntity, (admin) => admin.Product, { onDelete: "CASCADE" })
  public AdminUser: AdminUserEntity;

  @OneToMany(() => CartEntity, (cart) => cart.Product)
  public Cart: CartEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.Product, { cascade: true })
  public Payment: PaymentEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.Product, { cascade: true })
  public Review: ReviewEntity[];

  @OneToMany(() => InquiryRequestEntity, (inquiry) => inquiry.Product, { cascade: true })
  public InquiryRequest: InquiryRequestEntity[];
}
