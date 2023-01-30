import { CookieOptions } from "express";
import {
  JwtModuleAsyncOptions,
  JwtModuleOptions,
  JwtSignOptions,
  JwtVerifyOptions,
} from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

// 기존에 new ConfigService().get("JWT_SECRET") 방식을 사용하여 JWT 비밀키를 불러왔었는데 어느 순간 부터 이 방식으로 비밀키를 요청하면 undefined를 반환하게 되었다. 그래서 DotenvConfigurationModule클래스에 ConfigModule을 구성한 후, DotenvConfigurationModule을 임포트 해서 ConfigService를 DI 한 후 사용해 봤는데 정상적으로 비밀키를 불러올 수 있게 되었다.
@Injectable()
export class SecurityLibrary {
  constructor(private readonly configService: ConfigService) {}

  private readonly cookieOption: CookieOptions = {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + 100000000),
  };

  public getCookieOption(): CookieOptions {
    return this.cookieOption;
  }

  private readonly jwtAccessTokenSignOption: JwtSignOptions = {
    secret: this.configService.get("JWT_ACCESSTOKEN_SECRET"),
    expiresIn: this.configService.get("JWT_ACCESSTOKEN_EXPIRES"),
  };

  private readonly jwtAccessTokenVerifyOption: JwtVerifyOptions = {
    secret: this.configService.get("JWT_ACCESSTOKEN_SECRET"),
  };

  private readonly jwtRefreshTokenSignOption: JwtSignOptions = {
    secret: this.configService.get("JWT_REFRESHTOKEN_SECRET"),
    expiresIn: this.configService.get("JWT_REFRESHTOKEN_EXPIRES"),
  };

  private readonly jwtRefreshTokenVerifyOption: JwtVerifyOptions = {
    secret: this.configService.get("JWT_REFRESHTOKEN_SECRET"),
  };

  private readonly jwtAccessTokenModuleOption: JwtModuleOptions = {
    secret: this.configService.get("JWT_ACCESSTOKEN_SECRET"),
    signOptions: {
      expiresIn: this.configService.get("JWT_ACCESSTOKEN_EXPIRES"),
    },
  };

  private readonly jwtRefreshTokenModuleOption: JwtModuleOptions = {
    secret: this.configService.get("JWT_REFRESHTOKEN_SECRET"),
    signOptions: {
      expiresIn: this.configService.get("JWT_REFRESHTOKEN_EXPIRES"),
    },
  };

  public getJwtAceessTokenSignOption(): JwtSignOptions {
    return this.jwtAccessTokenSignOption;
  }

  public getJwtAcessTokenVerifyOption(): JwtVerifyOptions {
    return this.jwtAccessTokenVerifyOption;
  }

  public getJwtRefreshTokenSignOption(): JwtSignOptions {
    return this.jwtRefreshTokenSignOption;
  }

  public getJwtRefreshTokenVerifyOption(): JwtVerifyOptions {
    return this.jwtRefreshTokenVerifyOption;
  }

  public getJwtAccessTokenModuleOption(): JwtModuleOptions {
    return this.jwtAccessTokenModuleOption;
  }

  public getJwtRefreshTokenModuleOption(): JwtModuleOptions {
    return this.jwtRefreshTokenModuleOption;
  }

  public getJwtAccessTokenForJwtModule(): JwtModuleAsyncOptions {
    return {
      useFactory: () => this.getJwtAccessTokenModuleOption(),
    };
  }

  public getJwtRefreshTokenForJwtModule(): JwtModuleAsyncOptions {
    return {
      useFactory: () => this.getJwtRefreshTokenModuleOption(),
    };
  }
}
