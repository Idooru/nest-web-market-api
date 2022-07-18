import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./../../user/entities/user.entity";
import { ProductEntity } from "./../../product/entities/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { ReviewsImageEntity } from "src/model/upload/entities/review.image.entity";
import { ReviewsVideoEntity } from "src/model/upload/entities/review.video.entity";

@Entity("reviews")
export class ReviewsEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  reviews: string;

  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  @Column({ type: "enum", enum: [1, 2, 3, 4, 5] })
  userSelectScore: 1 | 2 | 3 | 4 | 5;

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: "reviewerId" })
  Reviewer: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Review)
  @JoinColumn({ name: "productId" })
  Product: ProductEntity;

  @OneToMany(() => ReviewsImageEntity, (image) => image.Review)
  Image?: ReviewsImageEntity[];

  @OneToMany(() => ReviewsVideoEntity, (video) => video.Review)
  Video?: ReviewsVideoEntity[];
}
