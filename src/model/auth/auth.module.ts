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
import { UserEntity } from "../user/entities/user.entity";
import { EtcModule } from "../etc/etc.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    TypeOrmModule.forFeature([
      UserEntity,
      UserProfileEntity,
      UserAuthEntity,
      UserActivityEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1m" },
    }),
    forwardRef(() => UserModule),
    forwardRef(() => EtcModule),
  ],
  providers: [AuthService, JwtStrategy, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}
