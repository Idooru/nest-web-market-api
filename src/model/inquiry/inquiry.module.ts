import {
  Module,
  forwardRef,
  NestModule,
  MiddlewareConsumer,
} from "@nestjs/common";
import { InquiryV1ClientController } from "./controllers/inquiry-v1-client.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { MediaModule } from "../media/media.module";
import { UserModule } from "../user/user.module";
import { ProductModule } from "../product/product.module";
import { LibraryModule } from "src/common/lib/library.module";
import { InquiryV1AdminController } from "./controllers/inquiry-v1-admin.controller";
import { DotenvAdaptModule } from "src/common/lib/env/dotenv-adapt.module";
import { InquiryResponseEntity } from "./entities/inquiry-response.entity";
import { inquirySelectProperty } from "src/common/config/repository-select-configs/inquiry.select";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { InquirySearcher } from "./logic/inquiry.searcher";
import { InquiryUpdateService } from "./services/inquiry-update.service";
import { InquirySearchRepository } from "./repositories/inquiry-search.repository";
import { InquiryTransactionExecutor } from "./logic/transaction/inquiry-transaction.executor";
import { InquiryUpdateRepository } from "./repositories/inquiry-update.repository";
import { InquiryTransactionInitializer } from "./logic/transaction/inquiry-transaction.initializer";
import { InquiryUtils } from "./logic/inquiry.utils";
import { InquiryFactoryService } from "./services/inquiry-factory.service";
import { InquiryRequestIdValidatePipe } from "./pipe/exist/inquiry-request-id-validate.pipe";
import { InquiryValidator } from "./logic/inquiry.validator";
import { InquiryValidateRepository } from "./repositories/inquiry-validate.repository";
import { mailEventMap } from "../../common/config/event-configs";
import { InquiryEventMapSetter } from "./logic/inquiry-event-map.setter";
import { InquiryClientEventMiddleware } from "./middleware/inquiry-client-event.middleware";
import { InquiryAdminEventMiddleware } from "./middleware/inquiry-admin-event.middleware";
import { DeleteInquiryRequestMediaMiddleware } from "../media/middleware/delete-inquiry-request-media.middleware";
import { Transactional } from "../../common/interfaces/initializer/transactional";
import { InquiryTransactionSearcher } from "./logic/transaction/inquiry-transaction.searcher";
import { InquiryTransactionContext } from "./logic/transaction/inquiry-transaction.context";

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiryRequestEntity, InquiryResponseEntity]),
    forwardRef(() => MediaModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    forwardRef(() => LibraryModule),
    DotenvAdaptModule,
  ],
  controllers: [InquiryV1ClientController, InquiryV1AdminController],
  providers: [
    { provide: "InquiryMediaCookieKey", useValue: inquiryMediaCookieKey },
    { provide: "InquirySelectProperty", useValue: inquirySelectProperty },
    { provide: "MailEventMap", useValue: mailEventMap },
    { provide: Transactional, useClass: InquiryTransactionInitializer },
    InquirySearcher,
    InquirySearchRepository,
    InquiryEventMapSetter,
    InquiryClientEventMiddleware,
    InquiryAdminEventMiddleware,
    InquiryTransactionInitializer,
    InquiryTransactionExecutor,
    InquiryTransactionSearcher,
    InquiryTransactionContext,
    InquiryUpdateService,
    InquiryUpdateRepository,
    InquiryFactoryService,
    InquiryUtils,
    InquiryRequestIdValidatePipe,
    InquiryValidator,
    InquiryValidateRepository,
  ],
})
export class InquiryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(InquiryClientEventMiddleware)
      .forRoutes(InquiryV1ClientController)
      .apply(InquiryAdminEventMiddleware)
      .forRoutes(InquiryV1AdminController)
      .apply(DeleteInquiryRequestMediaMiddleware)
      .forRoutes("")
      .apply(DeleteInquiryRequestMediaMiddleware)
      .forRoutes("");
  }
}
