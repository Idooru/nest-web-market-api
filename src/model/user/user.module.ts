import { ReviewModule } from "./../review/review.module";
import { UserActivityEntity } from "./entities/user.activity.entity";
import { UserAuthEntity } from "./entities/user.auth.entity";
import { UploadService } from "./../upload/services/upload.service";
import { UploadModule } from "./../upload/upload.module";
import { AuthModule } from "./../auth/auth.module";
import { UserRepository } from "./user.repository";
import { UserProfileEntity } from "./entities/user.profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserEntity } from "./entities/user.entity";
import { EtcModule } from "../etc/etc.module";

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
    EtcModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UploadService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
