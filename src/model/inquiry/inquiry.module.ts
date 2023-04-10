import { Module, forwardRef } from "@nestjs/common";
import { InquiryVersionOneOnlyClientController } from "./controllers/inquiry-v1-only-client.controller";
import { InquiryGeneralRepository } from "./repositories/inquiry-general.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InquiryRequestEntity } from "src/model/inquiry/entities/inquiry-request.entity";
import { MediaModule } from "../media/media.module";
import { UserModule } from "../user/user.module";
import { ProductModule } from "../product/product.module";
import { JwtModule } from "@nestjs/jwt";
import { LibraryModule } from "src/common/lib/library.module";
import { InquiryVersionOneOnlyAdminController } from "./controllers/inquiry-v1-only-admin.controller";
import { InquiryVersionOneVerifyController } from "./controllers/inquiry-v1-verify.controller";
import { InquiryVerifyService } from "./services/inquiry-verify.service";
import { InquiryVerifyRepository } from "./repositories/inquiry-verify.repository";
import { InquiryInsertRepository } from "./repositories/inquiry-insert.repository";
import { MailerConfigurationModule } from "src/common/config/mailer.config";
import { DotenvConfigurationModule } from "src/common/config/dotenv.config";
import { InquiryRequestAccessoryService } from "./services/request/inquiry-request-accessory.service";
import { InquiryRequestBundleService } from "./services/request/inquiry-request-bundle.service";
import { InquiryRequestGeneralService } from "./services/request/inquiry-request-general.service";
import { InquiryResponseAccessoryService } from "./services/response/inquiry-response-accessory.service";
import { InquiryResponseBundleService } from "./services/response/inquiry-response-bundle.service";
import { InquiryResponseGeneralService } from "./services/response/inquiry-response-general.service";
import { InquiryResponseEntity } from "./entities/inquiry-response.entity";
import { inquirySelectProperty } from "src/common/config/repository-select-configs/inquiry.select";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { inquiryVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/inquiry-verify-cookie.key";

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
    InquiryVersionOneVerifyController,
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
    InquiryRequestAccessoryService,
    InquiryRequestBundleService,
    InquiryRequestGeneralService,
    InquiryResponseAccessoryService,
    InquiryResponseBundleService,
    InquiryResponseGeneralService,
    InquiryVerifyService,
    InquiryGeneralRepository,
    InquiryVerifyRepository,
    InquiryInsertRepository,
  ],
  exports: [
    InquiryRequestAccessoryService,
    InquiryRequestBundleService,
    InquiryRequestGeneralService,
    InquiryResponseAccessoryService,
    InquiryResponseBundleService,
    InquiryResponseGeneralService,
    InquiryVerifyService,
    InquiryGeneralRepository,
    InquiryVerifyRepository,
    InquiryInsertRepository,
  ],
})
export class InquiryModule {}
