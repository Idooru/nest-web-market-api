import { Module, forwardRef } from "@nestjs/common";
import { InquiryGeneralService } from "./services/inquiry-general.service";
import { InquiryVersionOneOnlyClientController } from "./controllers/inquiry-v1-only-client.controller";
import { InquiryGeneralRepository } from "./repositories/inquiry-general.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InquiryEntity } from "src/model/inquiry/entities/inquiry.entity";
import { MediaModule } from "../media/media.module";
import { UserModule } from "../user/user.module";
import { ProductModule } from "../product/product.module";
import { JwtModule } from "@nestjs/jwt";
import { LibraryModule } from "src/common/lib/library.module";
import { InquiryVersionOneOnlyAdminController } from "./controllers/inquiry-v1-only-admin.controller";
import { InquiryVersionOneVerifyController } from "./controllers/inquiry-v1-verify.controller";
import { InquiryVerifyService } from "./services/inquiry-verify.service";
import { InquiryVerifyRepository } from "./repositories/inquiry-verify.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiryEntity]),
    forwardRef(() => MediaModule),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [
    InquiryVersionOneOnlyClientController,
    InquiryVersionOneOnlyAdminController,
    InquiryVersionOneVerifyController,
  ],
  providers: [
    InquiryGeneralService,
    InquiryGeneralRepository,
    InquiryVerifyService,
    InquiryVerifyRepository,
  ],
  exports: [
    InquiryGeneralService,
    InquiryGeneralRepository,
    InquiryVerifyService,
    InquiryVerifyRepository,
  ],
})
export class InquiryModule {}
