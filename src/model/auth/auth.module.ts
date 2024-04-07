import { UserProfileEntity } from "../user/entities/user-profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserAuthEntity } from "../user/entities/user-auth.entity";
import { ConfigService } from "@nestjs/config";
import { LibraryModule } from "src/common/lib/library.module";
import { SecurityLibrary } from "src/common/lib/security/security.library";
import { UserModule } from "../user/user.module";
import { AdminUserEntity } from "../user/entities/admin-user.entity";
import { ClientUserEntity } from "../user/entities/client-user.entity";
import { UserEntity } from "../user/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ClientUserEntity, AdminUserEntity, UserProfileEntity, UserAuthEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => LibraryModule),
    JwtModule.registerAsync(new SecurityLibrary(new ConfigService()).jwtAccessTokenForJwtModule),
    JwtModule.registerAsync(new SecurityLibrary(new ConfigService()).jwtRefreshTokenForJwtModule),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
