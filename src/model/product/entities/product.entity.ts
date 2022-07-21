import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewEntity } from "src/model/review/entities/review.entity";
import { StarRatingEntity } from "../../review/entities/star-rating.entity";
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

  @Column({ type: "int", default: 50 })
  quantity: number;

  @OneToOne(() => ProductImageEntity, (image) => image.Product)
  Image: ProductImageEntity;

  @OneToOne(() => StarRatingEntity, (starRating) => starRating.Product)
  StarRating: StarRatingEntity;

  @OneToMany(() => ReviewEntity, (review) => review.Product)
  Review: ReviewEntity[];

  @OneToMany(() => InquiryEntity, (inquiry) => inquiry.Product)
  Inquiry: InquiryEntity[];
}
