import { ProductModule } from "../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { ReviewEntity } from "./entities/review.entity";
import { UserModule } from "../user/user.module";
import { StarRateEntity } from "./entities/star-rate.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { MediaModule } from "../media/media.module";
import { ReviewVersionOneOnlyAdminController } from "./controllers/review-v1-only-admin.controller";
import { ReviewVersionOneOnlyClientController } from "./controllers/review-v1-only-client.controller";
import { reviewSelectProperty } from "src/common/config/repository-select-configs/review.select";
import { reviewMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { reviewVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/review-verify-cookie.key";
import { ReviewFactoryService } from "./services/review-factory.service";
import { ReviewUpdateRepository } from "./repositories/review-update.repository";
import { ReviewUpdateService } from "./services/review-update.service";
import { ReviewQueryRunnerProvider } from "./logic/transaction/review-query-runner.provider";
import { ReviewTransaction } from "./logic/transaction/review.transaction";
import { ReviewSearcher } from "./logic/review.searcher";
import { ReviewRepositoryVO } from "./logic/transaction/review-repository.vo";
import { ReviewSearchRepository } from "./repositories/review-search.repository";
import { ReviewUtils } from "./logic/review.utils";
import { ReviewIdValidatePipe } from "./pipe/exist/review-id-validate.pipe";
import { ReviewValidator } from "./logic/review.validator";
import { ReviewValidateRepository } from "./repositories/review-validate.repository";

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
  ],
  providers: [
    {
      provide: "ReviewMediaCookieKey",
      useValue: reviewMediaCookieKey,
    },
    {
      provide: "ReviewVerifyCookieKey",
      useValue: reviewVerifyCookieKey,
    },
    {
      provide: "ReviewSelectProperty",
      useValue: reviewSelectProperty,
    },
    ReviewSearcher,
    ReviewTransaction,
    ReviewFactoryService,
    ReviewUpdateService,
    ReviewUpdateRepository,
    ReviewQueryRunnerProvider,
    ReviewSearchRepository,
    ReviewRepositoryVO,
    ReviewUtils,
    ReviewValidator,
    ReviewIdValidatePipe,
    ReviewValidateRepository,
  ],
  exports: [],
})
export class ReviewModule {}
