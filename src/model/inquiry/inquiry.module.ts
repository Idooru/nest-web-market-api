import { Module, forwardRef } from "@nestjs/common";
import { InquiryVersionOneOnlyClientController } from "./controllers/inquiry-v1-only-client.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { MediaModule } from "../media/media.module";
import { UserModule } from "../user/user.module";
import { ProductModule } from "../product/product.module";
import { JwtModule } from "@nestjs/jwt";
import { LibraryModule } from "src/common/lib/library.module";
import { InquiryVersionOneOnlyAdminController } from "./controllers/inquiry-v1-only-admin.controller";
import { MailerConfigurationModule } from "src/common/config/mailer.config";
import { DotenvConfigurationModule } from "src/common/config/dotenv.config";
import { InquiryResponseEntity } from "./entities/inquiry-response.entity";
import { inquirySelectProperty } from "src/common/config/repository-select-configs/inquiry.select";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { inquiryVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/inquiry-verify-cookie.key";
import { InquirySearcher } from "./logic/inquiry.searcher";
import { InquiryOperationService } from "./services/inquiry-operation.service";
import { InquirySearchRepository } from "./repositories/inquiry-search.repository";
import { InquiryTransaction } from "./logic/transaction/inquiry.transaction";
import { InquiryOperationRepository } from "./repositories/inquiry-operation.repository";
import { InquiryQueryRunnerProvider } from "./logic/transaction/inquiry-query-runner.provider";
import { InquiryUtils } from "./logic/inquiry.utils";
import { InquiryFunctionService } from "./services/inquiry-function.service";
import { InquiryRepositoryVO } from "./logic/transaction/inquiry-repository.vo";
import { InquiryRequestIdValidatePipe } from "./pipe/exist/inquiry-request-id-validate.pipe";
import { InquiryValidator } from "./logic/inquiry.validator";
import { InquiryValidateRepository } from "./repositories/inquiry-validate.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiryRequestEntity, InquiryResponseEntity]),
    forwardRef(() => MediaModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    forwardRef(() => LibraryModule),
    JwtModule,
    MailerConfigurationModule,
    DotenvConfigurationModule,
  ],
  controllers: [
    InquiryVersionOneOnlyClientController,
    InquiryVersionOneOnlyAdminController,
  ],
  providers: [
    {
      provide: "InquiryMediaCookieKey",
      useValue: inquiryMediaCookieKey,
    },
    {
      provide: "InquiryVerifyCookieKey",
      useValue: inquiryVerifyCookieKey,
    },
    {
      provide: "InquirySelectProperty",
      useValue: inquirySelectProperty,
    },
    InquirySearcher,
    InquirySearchRepository,
    InquiryTransaction,
    InquiryQueryRunnerProvider,
    InquiryOperationService,
    InquiryOperationRepository,
    InquiryFunctionService,
    InquiryUtils,
    InquiryRepositoryVO,
    InquiryRequestIdValidatePipe,
    InquiryValidator,
    InquiryValidateRepository,
  ],
})
export class InquiryModule {}
