import { forwardRef, Module } from "@nestjs/common";
import { PromisesConfig } from "./promises.config";
import { ReviewModule } from "src/model/review/review.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EtcConfig } from "./etc.config";
import { ProductModule } from "src/model/product/product.module";
import { AuthModule } from "src/model/auth/auth.module";
import { UserModule } from "src/model/user/user.module";
import { UploadModule } from "src/model/upload/upload.module";
import { MulterConfig } from "./multer.config";

@Module({
  imports: [
    forwardRef(() => ReviewModule),
    forwardRef(() => ProductModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => UploadModule),
    ConfigModule.forRoot(),
  ],
  providers: [ConfigService, PromisesConfig, EtcConfig, MulterConfig],
  exports: [PromisesConfig, EtcConfig, MulterConfig],
})
export class AppConfigModule {}
