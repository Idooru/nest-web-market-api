import { ProductModule } from "./../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { ReviewService } from "./providers/review.service";
import { ReviewController } from "./controllers/review.controller";
import { ReviewEntity } from "./entities/review.entity";
import { UserModule } from "../user/user.module";
import { ReviewRepository } from "./providers/review.repository";
import { StarRatingEntity } from "../review/entities/star-rating.entity";
import { StarRatingRepository } from "../review/providers/star-rating.repository";
import { StarRatingService } from "./providers/star-rating.service";
import { UploadModule } from "../upload/upload.module";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, StarRatingEntity]),
    forwardRef(() => UploadModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    StarRatingService,
    ReviewRepository,
    StarRatingRepository,
  ],
  exports: [
    ReviewService,
    ReviewRepository,
    StarRatingService,
    StarRatingRepository,
  ],
})
export class ReviewModule {}
