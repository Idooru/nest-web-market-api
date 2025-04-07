import { Module, forwardRef } from "@nestjs/common";
import { InquiryV1ClientController } from "./controllers/inquiry-v1-client.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { MediaModule } from "../media/media.module";
import { UserModule } from "../user/user.module";
import { ProductModule } from "../product/product.module";
import { LibraryModule } from "src/common/lib/library.module";
import { InquiryV1AdminController } from "./controllers/inquiry-v1-admin.controller";
import { InquiryResponseEntity } from "./entities/inquiry-response.entity";
import { inquirySelect } from "src/common/config/repository-select-configs/inquiry.select";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { InquiryService } from "./services/inquiry.service";
import { InquiryTransactionExecutor } from "./logic/transaction/inquiry-transaction.executor";
import { InquiryUpdateRepository } from "./repositories/inquiry-update.repository";
import { InquiryTransactionInitializer } from "./logic/transaction/inquiry-transaction.initializer";
import { InquiryRequestIdValidatePipe } from "./pipe/exist/inquiry-request-id-validate.pipe";
import { InquiryValidator } from "./logic/inquiry.validator";
import { InquiryValidateRepository } from "./repositories/inquiry-validate.repository";
import { mailEventMap } from "../../common/config/event-configs";
import { InquiryEventMapSetter } from "./logic/inquiry-event-map.setter";
import { Transactional } from "../../common/interfaces/initializer/transactional";
import { InquiryTransactionSearcher } from "./logic/transaction/inquiry-transaction.searcher";
import { InquiryTransactionContext } from "./logic/transaction/inquiry-transaction.context";
import { InquiryRequestSearcher } from "./logic/inquiry-request.searcher";
import { InquiryRequestSearchRepository } from "./repositories/inquiry-request-search.repository";
import { InquiryResponseSearcher } from "./logic/inquiry-response.searcher";
import { InquiryResponseSearchRepository } from "./repositories/inquiry-response-search.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiryRequestEntity, InquiryResponseEntity]),
    forwardRef(() => MediaModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    forwardRef(() => LibraryModule),
  ],
  controllers: [InquiryV1ClientController, InquiryV1AdminController],
  providers: [
    { provide: "inquiry-media-cookie-key", useValue: inquiryMediaCookieKey },
    { provide: "inquiry-select", useValue: inquirySelect },
    { provide: "mail-event-map", useValue: mailEventMap },
    { provide: Transactional, useClass: InquiryTransactionInitializer },
    InquiryRequestSearcher,
    InquiryRequestSearchRepository,
    InquiryResponseSearcher,
    InquiryResponseSearchRepository,
    InquiryEventMapSetter,
    InquiryTransactionInitializer,
    InquiryTransactionExecutor,
    InquiryTransactionSearcher,
    InquiryTransactionContext,
    InquiryService,
    InquiryUpdateRepository,
    InquiryRequestIdValidatePipe,
    InquiryValidator,
    InquiryValidateRepository,
  ],
})
export class InquiryModule {}
