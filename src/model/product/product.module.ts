import { forwardRef, Module } from "@nestjs/common";
import { MediaModule } from "../media/media.module";
import { ProductV1Controller } from "./controllers/v1/product-v1.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { ReviewModule } from "../review/review.module";
import { InquiryModule } from "../inquiry/inquiry.module";
import { ProductImageEntity } from "../media/entities/product-image.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { ProductV1AdminController } from "./controllers/v1/product-v1-admin.controller";
import { productSelect } from "src/common/config/repository-select-configs/product.select";
import { productMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { ProductSearcher } from "./logic/product.searcher";
import { ProductSearchRepository } from "./repositories/product-search.repository";
import { ProductTransactionExecutor } from "./logic/transaction/product-transaction.executor";
import { ProductService } from "./services/product.service";
import { ProductUpdateRepository } from "./repositories/product-update.repository";
import { ProductEntity } from "./entities/product.entity";
import { ProductTransactionInitializer } from "./logic/transaction/product-transaction.initializer";
import { ProductValidator } from "./logic/product.validator";
import { ProductValidateRepository } from "./repositories/product-validate.repository";
import { ProductIdValidatePipe } from "./pipe/exist/product-id-validate.pipe";
import { Transactional } from "../../common/interfaces/initializer/transactional";
import { ProductTransactionSearcher } from "./logic/transaction/product-transaction.searcher";
import { ProductTransactionContext } from "./logic/transaction/product-transaction.context";

const productIdFilter = { provide: "product-id-filter", useValue: "product.id = :id" };

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => MediaModule),
    forwardRef(() => ReviewModule),
    forwardRef(() => InquiryModule),
    LibraryModule,
  ],
  controllers: [ProductV1Controller, ProductV1AdminController],
  providers: [
    { provide: "product-media-cookie-key", useValue: productMediaCookieKey },
    { provide: "product-select", useValue: productSelect },
    { provide: Transactional, useClass: ProductTransactionInitializer },
    productIdFilter,
    ProductSearcher,
    ProductValidator,
    ProductTransactionInitializer,
    ProductTransactionExecutor,
    ProductTransactionSearcher,
    ProductTransactionContext,
    ProductService,
    ProductUpdateRepository,
    ProductSearchRepository,
    ProductValidateRepository,
    ProductIdValidatePipe,
  ],
  exports: [productIdFilter, ProductSearcher, ProductSearchRepository, ProductIdValidatePipe, ProductValidator],
})
export class ProductModule {}
