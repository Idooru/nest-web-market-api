import { ProductModule } from "./../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { ReviewService } from "./providers/review.service";
import { ReviewController } from "./controllers/review.controller";
import { ReviewEntity } from "./entities/review.entity";
import { UserModule } from "../user/user.module";
import { ReviewRepository } from "./providers/review.repository";
import { StarRatingEntity } from "../review/entities/star-rating.entity";
import { StarRatingReposiotry } from "../review/providers/star-rating.repository";
import { EtcModule } from "../etc/etc.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, StarRatingEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    forwardRef(() => EtcModule),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, StarRatingReposiotry],
  exports: [ReviewService, ReviewRepository],
})
export class ReviewModule {}
