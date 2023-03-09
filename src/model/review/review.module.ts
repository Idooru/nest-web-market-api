import { ProductModule } from "../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { ReviewGeneralService } from "./services/review-general.service";
import { ReviewVersionOneOnlyAdminController } from "./controllers/review-v1-only-client.controller";
import { ReviewEntity } from "./entities/review.entity";
import { UserModule } from "../user/user.module";
import { ReviewGeneralRepository } from "./repositories/review-general.repository";
import { StarRateEntity } from "./entities/star-rate.entity";
import { StarRateRepository } from "./repositories/star-rate-general.repository";
import { StarRateService } from "./services/star-rate-general.service";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { ReviewVersionOneVerify } from "./controllers/review-v1-verify.controller";
import { ReviewVerifyService } from "./services/review-verify.service";
import { ReviewVerifyRepository } from "./repositories/review-verify.repository";
import { MediaModule } from "../media/media.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, StarRateEntity]),
    forwardRef(() => MediaModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [
    ReviewVersionOneOnlyAdminController,
    ReviewVersionOneOnlyAdminController,
    ReviewVersionOneVerify,
  ],
  providers: [
    ReviewGeneralService,
    ReviewGeneralRepository,
    ReviewVerifyService,
    ReviewVerifyRepository,
    StarRateService,
    StarRateRepository,
  ],
  exports: [
    ReviewGeneralService,
    ReviewGeneralRepository,
    ReviewVerifyService,
    ReviewVerifyRepository,
    StarRateService,
    StarRateRepository,
  ],
})
export class ReviewModule {}
