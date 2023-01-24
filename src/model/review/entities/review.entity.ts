import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ProductEntity } from "./../../product/entities/product.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { ReviewImageEntity } from "src/model/upload/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/upload/entities/review.video.entity";
import { UserActivityEntity } from "../../user/entities/user.activity.entity";

@Entity("reviews")
export class ReviewEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", nullable: false })
  reviews: string;

  @IsEnum([1, 2, 3, 4, 5])
  @IsNotEmpty()
  @Column({ type: "enum", enum: [1, 2, 3, 4, 5] })
  userSelectScore: 1 | 2 | 3 | 4 | 5;

  @ManyToOne(() => UserActivityEntity, (activity) => activity.Review, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userActivityId" })
  UserActivity: UserActivityEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Review)
  @JoinColumn({ name: "productId" })
  Product: ProductEntity;

  @OneToMany(() => ReviewImageEntity, (image) => image.Review)
  Image?: ReviewImageEntity[];

  @OneToMany(() => ReviewVideoEntity, (video) => video.Review)
  Video?: ReviewVideoEntity[];
}
