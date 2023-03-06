import { UserProfileEntity } from "../user/entities/user.profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { AuthGeneralService } from "./services/auth-general.service";
import { JwtModule } from "@nestjs/jwt";
import { UserAuthEntity } from "../user/entities/user.auth.entity";
import { ConfigService } from "@nestjs/config";
import { LibraryModule } from "src/common/lib/library.module";
import { SecurityLibrary } from "src/common/lib/security.library";
import { UserModule } from "../user/user.module";
import { AuthExistService } from "./services/auth-exist.service";
import { AdminUserEntity } from "../user/entities/admin-user.entity";
import { ClientUserEntity } from "../user/entities/client-user.entity";
import { UserEntity } from "../user/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ClientUserEntity,
      AdminUserEntity,
      UserProfileEntity,
      UserAuthEntity,
    ]),
    forwardRef(() => UserModule),
    JwtModule.registerAsync(
      new SecurityLibrary(new ConfigService()).getJwtAccessTokenForJwtModule(),
    ),
    JwtModule.registerAsync(
      new SecurityLibrary(new ConfigService()).getJwtRefreshTokenForJwtModule(),
    ),
    LibraryModule,
  ],
  providers: [AuthGeneralService, AuthExistService],
  exports: [AuthGeneralService],
})
export class AuthModule {}
