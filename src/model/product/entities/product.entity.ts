import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { StarRateEntity } from "../../review/entities/star-rate.entity";
import { ProductImageEntity } from "src/model/upload/entities/product.image.entity";
import { InquiryEntity } from "../../inquiry/entities/inquiry.entity";

@Entity("products")
export class ProductEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  name: string;

  @IsNumber()
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

  @IsNumber()
  @Column({ type: "int", unsigned: true, default: 50 })
  quantity: number;

  @OneToOne(() => ProductImageEntity, (image) => image.Product, {
    cascade: true,
  })
  Image: ProductImageEntity;

  @OneToOne(() => StarRateEntity, (StarRate) => StarRate.Product, {
    cascade: true,
  })
  StarRate: StarRateEntity;

  @OneToMany(() => ReviewEntity, (review) => review.Product, { cascade: true })
  Review: ReviewEntity[];

  @OneToMany(() => InquiryEntity, (inquiry) => inquiry.Product, {
    cascade: true,
  })
  Inquiry: InquiryEntity[];
}
