import { ReviewModule } from "../review/review.module";
import { UserAuthEntity } from "./entities/user.auth.entity";
import { MediaModule } from "../media/media.module";
import { AuthModule } from "../auth/auth.module";
import { UserProfileEntity } from "./entities/user.profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { UserGeneralService } from "./services/user-general.service";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { UserVersionOneFreeUseController } from "./controllers/v1/user-v1-free-use.controller";
import { UserVersionOneOnlyAdminController } from "./controllers/v1/user-v1-only-admin.controller";
import { UserGeneralRepository } from "./repositories/user-general.repository";
import { UserVerifyService } from "./services/user-verify.service";
import { UserVerifyRepository } from "./repositories/user-verify.repository";
import { UserVersionOneVerifyController } from "./controllers/v1/user-v1-verify.controller";
import { ClientUserEntity } from "./entities/client-user.entity";
import { AdminUserEntity } from "./entities/admin-user.entity";
import { UserEntity } from "./entities/user.entity";
import { UserInsertRepository } from "./repositories/user-insert.repository";
import { userSelectProperty } from "src/common/config/repository-select-configs/user.select";
import { userVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/user-verify-cookie.key";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserProfileEntity,
      UserAuthEntity,
      ClientUserEntity,
      AdminUserEntity,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => MediaModule),
    forwardRef(() => ReviewModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [
    UserVersionOneFreeUseController,
    UserVersionOneOnlyAdminController,
    UserVersionOneVerifyController,
  ],
  providers: [
    {
      provide: "UserVerifyCookieKey",
      useValue: userVerifyCookieKey,
    },
    {
      provide: "UserSelectProperty",
      useValue: userSelectProperty,
    },
    UserGeneralService,
    UserVerifyService,
    UserGeneralRepository,
    UserVerifyRepository,
    UserInsertRepository,
  ],
  exports: [
    UserGeneralService,
    UserVerifyService,
    UserGeneralRepository,
    UserVerifyRepository,
    UserInsertRepository,
  ],
})
export class UserModule {}
