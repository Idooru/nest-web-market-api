import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from "@nestjs/common";
import { MediaModule } from "../media/media.module";
import { ProductVersionOneFreeUseController } from "./controllers/v1/product-v1-free-use.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { ReviewModule } from "../review/review.module";
import { InquiryModule } from "../inquiry/inquiry.module";
import { ProductImageEntity } from "../media/entities/product-image.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { ProductVersionOneOnlyAdminController } from "./controllers/v1/product-v1-only-admin.controller";
import { JwtModule } from "@nestjs/jwt";
import { productSelectProperty } from "src/common/config/repository-select-configs/product.select";
import { productMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { ProductFactoryService } from "./services/product-factory.service";
import { ProductSearcher } from "./logic/product.searcher";
import { ProductSearchRepository } from "./repositories/product-search.repository";
import { ProductRepositoryVO } from "./logic/transaction/product-repository.vo";
import { ProductTransaction } from "./logic/transaction/product.transaction";
import { ProductUpdateService } from "./services/product-update.service";
import { ProductUpdateRepository } from "./repositories/product-update.repository";
import { ProductEntity } from "./entities/product.entity";
import { ProductQueryRunnerProvider } from "./logic/transaction/product-query-runner.provider";
import { ProductValidator } from "./logic/product.validator";
import { ProductValidateRepository } from "./repositories/product-validate.repository";
import { ProductIdValidatePipe } from "./pipe/exist/product-id-validate.pipe";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => MediaModule),
    forwardRef(() => ReviewModule),
    forwardRef(() => InquiryModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [
    ProductVersionOneFreeUseController,
    ProductVersionOneOnlyAdminController,
  ],
  providers: [
    {
      provide: "ProductMediaCookieKey",
      useValue: productMediaCookieKey,
    },
    {
      provide: "ProductsSelectProperty",
      useValue: productSelectProperty,
    },
    ProductSearcher,
    ProductValidator,
    ProductQueryRunnerProvider,
    ProductTransaction,
    ProductRepositoryVO,
    ProductUpdateService,
    ProductFactoryService,
    ProductUpdateRepository,
    ProductSearchRepository,
    ProductValidateRepository,
    ProductIdValidatePipe,
  ],
  exports: [
    ProductSearcher,
    ProductSearchRepository,
    ProductIdValidatePipe,
    ProductValidator,
  ],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(TestMiddleware).forRoutes("/api/v1/verify/product");
    // consumer.apply(TestMiddleware).forRoutes("/api/v1/free-use/product");
    // consumer.apply(TestMiddleware).forRoutes("/api/v1/only-admin/product");
  }
}
