import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewsEntity } from "src/model/review/entities/review.entity";
import { StarRatingEntity } from "../../review/entities/star-rating.entity";
import { ProductsImageEntity } from "src/model/upload/entities/product.image.entity";
import { InquiriesEntity } from "../../inquiry/entities/inquiry.entity";

@Entity("products")
export class ProductsEntity extends CommonEntity {
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

  @OneToOne(() => ProductsImageEntity, (image) => image.Product)
  Image: ProductsImageEntity;

  @OneToOne(() => StarRatingEntity, (starRating) => starRating.Product)
  StarRating: StarRatingEntity;

  @OneToMany(() => ReviewsEntity, (review) => review.Product)
  Review: ReviewsEntity[];

  @OneToMany(() => InquiriesEntity, (inquiry) => inquiry.Product)
  Inquiry: InquiriesEntity[];
}
