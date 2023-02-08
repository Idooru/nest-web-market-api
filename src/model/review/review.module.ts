import { ProductModule } from "../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { ReviewService } from "./providers/review.service";
import { ReviewVersionOneFreeUseController } from "./controllers/review-v1-free-use.controller";
import { ReviewEntity } from "./entities/review.entity";
import { UserModule } from "../user/user.module";
import { ReviewRepository } from "./providers/review.repository";
import { StarRatingEntity } from "./entities/star-rating.entity";
import { StarRatingRepository } from "./providers/star-rating.repository";
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
  controllers: [ReviewVersionOneFreeUseController],
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
