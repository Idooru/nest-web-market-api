import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { UserProfileEntity } from "../user/entities/user.profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthRepository } from "./providers/auth.repository";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { Module } from "@nestjs/common";
import { AuthService } from "./providers/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { forwardRef } from "@nestjs/common";
import { UserAuthEntity } from "../user/entities/user.auth.entity";
import { UsersEntity } from "../user/entities/user.entity";
import { EtcModule } from "../../common/config/etc/etc.module";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    TypeOrmModule.forFeature([
      UsersEntity,
      UserProfileEntity,
      UserAuthEntity,
      UserActivityEntity,
    ]),
    JwtModule.register({
      secret: new ConfigService().get("JWT_SECRET"),
      signOptions: { expiresIn: "1d" },
    }),
    forwardRef(() => UserModule),
    forwardRef(() => EtcModule),
  ],
  providers: [AuthService, JwtStrategy, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}
