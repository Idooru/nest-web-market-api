import { UserActivityEntity } from "src/model/user/entities/user.activity.entity";
import { UserProfileEntity } from "../user/entities/user.profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthRepository } from "./providers/auth.repository";
import { UserModule } from "./../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { Module } from "@nestjs/common";
import { AuthService } from "./providers/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { forwardRef } from "@nestjs/common";
import { UserAuthEntity } from "../user/entities/user.auth.entity";
import { UserEntity } from "../user/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { LibraryModule } from "src/common/lib/library.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserProfileEntity,
      UserAuthEntity,
      UserActivityEntity,
    ]),
    JwtModule.registerAsync({
      // 개발 모드와 배포 모드를 따로 나눈 후 이유를 알 수 없게 .env 파일에 있는 JWT_SECRET을 읽어 올 수 없어서 에러가 났다. 해당 내용은 구글링 후 아래 url에 적힌 대로 하여 해결하였다.
      // https://velog.io/@daep93/Nestjs-secretOrPrivateKey-must-have-a-value
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
    forwardRef(() => UserModule),
    LibraryModule,
  ],
  providers: [AuthService, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}
