import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { UserProfileEntity } from "../user/entities/user.profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./providers/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UserAuthEntity } from "../user/entities/user.auth.entity";
import { UserEntity } from "../user/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { LibraryModule } from "src/common/lib/library.module";
import { SecurityLibrary } from "src/common/lib/security.library";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserProfileEntity,
      UserAuthEntity,
      UserActivityEntity,
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
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
