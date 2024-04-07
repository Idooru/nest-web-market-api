import { ProductModule } from "../product/product.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ReviewEntity } from "./entities/review.entity";
import { UserModule } from "../user/user.module";
import { StarRateEntity } from "./entities/star-rate.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { MediaModule } from "../media/media.module";
import { ReviewV1ClientController } from "./controllers/v1/review-v1-client.controller";
import { reviewSelectProperty } from "src/common/config/repository-select-configs/review.select";
import { reviewMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { ReviewFactoryService } from "./services/review-factory.service";
import { ReviewUpdateRepository } from "./repositories/review-update.repository";
import { ReviewUpdateService } from "./services/review-update.service";
import { ReviewTransactionInitializer } from "./logic/transaction/review-transaction.initializer";
import { ReviewTransactionExecutor } from "./logic/transaction/review-transaction.executor";
import { ReviewSearcher } from "./logic/review.searcher";
import { ReviewSearchRepository } from "./repositories/review-search.repository";
import { ReviewUtils } from "./logic/review.utils";
import { ReviewIdValidatePipe } from "./pipe/exist/review-id-validate.pipe";
import { ReviewValidator } from "./logic/review.validator";
import { ReviewValidateRepository } from "./repositories/review-validate.repository";
import { DeleteReviewMediaMiddleware } from "../media/middleware/delete-review-media.middleware";
import { ReviewV1AdminController } from "./controllers/v1/review-v1-admin.controller";
import { Transactional } from "../../common/interfaces/initializer/transactional";
import { ReviewTransactionContext } from "./logic/transaction/review-transaction.context";
import { ReviewTransactionSearcher } from "./logic/transaction/review-transaction.searcher";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, StarRateEntity]),
    forwardRef(() => MediaModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    LibraryModule,
  ],
  controllers: [ReviewV1AdminController, ReviewV1ClientController],
  providers: [
    { provide: "ReviewMediaCookieKey", useValue: reviewMediaCookieKey },
    { provide: "ReviewSelectProperty", useValue: reviewSelectProperty },
    { provide: Transactional, useClass: ReviewTransactionInitializer },
    ReviewSearcher,
    ReviewTransactionExecutor,
    ReviewFactoryService,
    ReviewUpdateService,
    ReviewUpdateRepository,
    ReviewTransactionInitializer,
    ReviewSearchRepository,
    ReviewUtils,
    ReviewValidator,
    ReviewIdValidatePipe,
    ReviewValidateRepository,
    ReviewTransactionContext,
    ReviewTransactionSearcher,
  ],
  exports: [],
})
export class ReviewModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(DeleteReviewMediaMiddleware)
      .forRoutes({
        path: "/api/v1/client/review/*",
        method: RequestMethod.DELETE,
      })
      .apply(DeleteReviewMediaMiddleware)
      .forRoutes({
        path: "/api/v1/client/review/*",
        method: RequestMethod.PUT,
      });
  }
}
