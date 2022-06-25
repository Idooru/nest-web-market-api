import { UserActivityEntity } from "./entities/user.activity.entity";
import { UserAuthEntity } from "./entities/user.auth.entity";
import { UploadService } from "./../upload/services/upload.service";
import { UploadModule } from "./../upload/upload.module";
import { AuthModule } from "./../auth/auth.module";
import { UserRepository } from "./user.repository";
import { UserCommonEntity } from "./entities/user.common.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserCoreEntity } from "./entities/user.core.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserCoreEntity,
      UserCommonEntity,
      UserAuthEntity,
      UserActivityEntity,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UploadModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UploadService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
