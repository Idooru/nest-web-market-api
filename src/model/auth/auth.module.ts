import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { UserCommonEntity } from "../user/entities/user.common.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthRepository } from "./auth.repository";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { forwardRef } from "@nestjs/common";
import { UserAuthEntity } from "../user/entities/user.auth.entity";
import { UserCoreEntity } from "../user/entities/user.core.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: "jwt", session: false }),
    TypeOrmModule.forFeature([
      UserCoreEntity,
      UserCommonEntity,
      UserAuthEntity,
      UserActivityEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1m" },
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtStrategy, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}
