import { Column, Entity, OneToMany, ManyToOne } from "typeorm";
import { ProductEntity } from "../../product/entities/product.entity";
import { IsNotEmpty, IsEnum, IsNumber } from "class-validator";
import { ReviewImageEntity } from "src/model/media/entities/review-image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review-video.entity";
import { ClientUserEntity } from "src/model/user/entities/client-user.entity";
import { PostEntity } from "src/common/entities/post.entity";
import { StarRateScore, starRateScore } from "../types/star-rate-score.type";

@Entity({ name: "reviews", synchronize: true })
export class ReviewEntity extends PostEntity {
  @IsEnum(starRateScore)
  @IsNotEmpty()
  @Column({ type: "enum", enum: starRateScore })
  public starRateScore: StarRateScore;

  @IsEnum([0, 1, 2])
  @IsNumber()
  @Column({ type: "enum", enum: [0, 1, 2], default: 2 })
  public countForModify: number;

  @ManyToOne(() => ClientUserEntity, (clientUser) => clientUser.Review, {
    onDelete: "SET NULL",
  })
  public ClientUser: ClientUserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.Review, {
    onDelete: "SET NULL",
  })
  public Product: ProductEntity;

  @OneToMany(() => ReviewImageEntity, (image) => image.Review, {
    cascade: true,
  })
  public ReviewImage?: ReviewImageEntity[];

  @OneToMany(() => ReviewVideoEntity, (video) => video.Review, {
    cascade: true,
  })
  public ReviewVideo?: ReviewVideoEntity[];
}
