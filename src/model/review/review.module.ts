import { ProductModule } from "../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { ReviewGeneralService } from "./services/review-general.service";
import { ReviewEntity } from "./entities/review.entity";
import { UserModule } from "../user/user.module";
import { ReviewGeneralRepository } from "./repositories/review-general.repository";
import { StarRateEntity } from "./entities/star-rate.entity";
import { StarRateGeneralRepository } from "./repositories/star-rate-general.repository";
import { StarRateGeneralService } from "./services/star-rate-general.service";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { ReviewVersionOneVerifyController } from "./controllers/review-v1-verify.controller";
import { ReviewVerifyService } from "./services/review-verify.service";
import { ReviewVerifyRepository } from "./repositories/review-verify.repository";
import { MediaModule } from "../media/media.module";
import { ReviewVersionOneOnlyAdminController } from "./controllers/review-v1-only-admin.controller";
import { ReviewVersionOneOnlyClientController } from "./controllers/review-v1-only-client.controller";
import { StarRateInsertRepository } from "./repositories/star-rate-insert.repository";
import { ReviewInsertRepository } from "./repositories/review-insert.repository";
import { ReviewAccessoryService } from "./services/review-accessory.service";
import { ReviewBundleService } from "./services/review-bundle.service";
import { reviewSelectProperty } from "src/common/config/repository-select-configs/review.select";

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
    ReviewVersionOneOnlyClientController,
    ReviewVersionOneVerifyController,
  ],
  providers: [
    {
      provide: "ReviewSelectProperty",
      useValue: reviewSelectProperty,
    },
    ReviewGeneralService,
    ReviewVerifyService,
    ReviewBundleService,
    ReviewAccessoryService,
    StarRateGeneralService,
    ReviewVerifyRepository,
    ReviewGeneralRepository,
    StarRateGeneralRepository,
    ReviewInsertRepository,
    ReviewVerifyRepository,
    StarRateInsertRepository,
  ],
  exports: [
    ReviewGeneralService,
    ReviewVerifyService,
    ReviewBundleService,
    ReviewAccessoryService,
    StarRateGeneralService,
    ReviewVerifyRepository,
    ReviewGeneralRepository,
    StarRateGeneralRepository,
    ReviewInsertRepository,
    ReviewVerifyRepository,
    StarRateInsertRepository,
  ],
})
export class ReviewModule {}
