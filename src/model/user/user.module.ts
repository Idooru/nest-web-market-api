import { ReviewModule } from "../review/review.module";
import { UserActivityEntity } from "./entities/user.activity.entity";
import { UserAuthEntity } from "./entities/user.auth.entity";
import { UploadService } from "../upload/providers/upload.service";
import { UploadModule } from "../upload/upload.module";
import { AuthModule } from "../auth/auth.module";
import { UserGeneralRepository } from "./providers/user-general.repository";
import { UserProfileEntity } from "./entities/user.profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./providers/user.service";
import { UserEntity } from "./entities/user.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { UserVersionOneFreeUseController } from "./controllers/user-v1-free-use.controller";
import { UserVersionOneOnlyAdminController } from "./controllers/user-v1-only-admin.controller";
import { UserExistRepository } from "./providers/user-exist.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserProfileEntity,
      UserAuthEntity,
      UserActivityEntity,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UploadModule),
    forwardRef(() => ReviewModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [
    UserVersionOneFreeUseController,
    UserVersionOneOnlyAdminController,
  ],
  providers: [UserService, UserGeneralRepository, UserExistRepository],
  exports: [UserService, UserGeneralRepository, UserExistRepository],
})
export class UserModule {}
