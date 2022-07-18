import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewEntity } from "../../review/entities/review.entity";
import { StarRatingEntity } from "../../review/entities/star-rating.entity";
import { ProductsImageEntity } from "src/model/upload/entities/product.image.entity";

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

  @OneToOne(() => ProductsImageEntity, (image) => image.Product)
  Image: ProductsImageEntity;

  @OneToOne(() => StarRatingEntity, (starRating) => starRating.Product)
  @JoinColumn({ name: "starRatingId" })
  StarRating: StarRatingEntity;

  @OneToMany(() => ReviewEntity, (review) => review.Product)
  Review: ReviewEntity;
}
