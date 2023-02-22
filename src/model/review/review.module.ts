import { ProductModule } from "../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { ReviewGeneralService } from "./services/review-general.service";
import { ReviewVersionOneFreeUseController } from "./controllers/review-v1-free-use.controller";
import { ReviewEntity } from "./entities/review.entity";
import { UserModule } from "../user/user.module";
import { ReviewGeneralRepository } from "./repositories/review-general.repository";
import { StarRateEntity } from "./entities/star-rate.entity";
import { StarRateRepository } from "./repositories/star-rate-general.repository";
import { StarRateService } from "./services/star-rate-general.service";
import { UploadModule } from "../upload/upload.module";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { ReviewVersionOneOnlyAdminController } from "./controllers/review-v1-only-admin.controller";
import { ReviewVersionOneVerify } from "./controllers/review-v1-verify.controller";
import { ReviewVerifyService } from "./services/review-verify.service";
import { ReviewVerifyRepository } from "./repositories/review-verify.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, StarRateEntity]),
    forwardRef(() => UploadModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [
    ReviewVersionOneFreeUseController,
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
