import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  RelationId,
} from "typeorm";
import { ImagesEntity } from "../../upload/entities/upload.entity";
import { float } from "aws-sdk/clients/lightsail";
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CommonEntity } from "src/common/entities/common.entity";
import { ReviewEntity } from "../../review/entities/review.entity";
import { RatingEntity } from "./rating.entity";

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

  @Column({ type: "float", default: 0.0 })
  ratingPoint: number;

  @OneToOne(() => RatingEntity, (rating) => rating.product)
  @JoinColumn({ name: "ratingId", referencedColumnName: "id" })
  rating: RatingEntity;

  @OneToOne(() => ImagesEntity, (image) => image.product)
  @JoinColumn({ name: "imageId", referencedColumnName: "id" })
  image: ImagesEntity;

  @ManyToMany(() => ReviewEntity, (review) => review.product)
  review: ReviewEntity[];
}
