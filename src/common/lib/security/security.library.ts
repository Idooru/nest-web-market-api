import { CookieOptions } from "express";
import { JwtModuleAsyncOptions, JwtModuleOptions, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
// eslint-disable-next-line max-len
// 기존에 new ConfigService().get("JWT_SECRET") 방식을 사용하여 JWT 비밀키를 불러왔었는데 어느 순간 부터 이 방식으로 비밀키를 요청하면 undefined를 반환하게 되었다. 그래서 DotenvConfigurationModule클래스에 ConfigModule을 구성한 후, DotenvConfigurationModule을 임포트 해서 ConfigService를 DI 한 후 사용해 봤는데 정상적으로 비밀키를 불러올 수 있게 되었다.
@Injectable()
export class SecurityLibrary {
  constructor(private readonly configService: ConfigService) {}

  private readonly _cookieOption: CookieOptions = {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + 100000000),
  };

  public get cookieOption(): CookieOptions {
    return this._cookieOption;
  }

  public get hashSalt(): number {
    return +this.configService.get("HASH_SALT");
  }

  private readonly _jwtAccessTokenSignOption: JwtSignOptions = {
    secret: this.configService.get("JWT_ACCESSTOKEN_SECRET"),
    expiresIn: this.configService.get("JWT_ACCESSTOKEN_EXPIRES"),
  };

  private readonly _jwtAccessTokenVerifyOption: JwtVerifyOptions = {
    secret: this.configService.get("JWT_ACCESSTOKEN_SECRET"),
  };

  private readonly _jwtRefreshTokenSignOption: JwtSignOptions = {
    secret: this.configService.get("JWT_REFRESHTOKEN_SECRET"),
    expiresIn: this.configService.get("JWT_REFRESHTOKEN_EXPIRES"),
  };

  private readonly _jwtRefreshTokenVerifyOption: JwtVerifyOptions = {
    secret: this.configService.get("JWT_REFRESHTOKEN_SECRET"),
  };

  private readonly _jwtAccessTokenModuleOption: JwtModuleOptions = {
    secret: this.configService.get("JWT_ACCESSTOKEN_SECRET"),
    signOptions: {
      expiresIn: this.configService.get("JWT_ACCESSTOKEN_EXPIRES"),
    },
  };

  private readonly _jwtRefreshTokenModuleOption: JwtModuleOptions = {
    secret: this.configService.get("JWT_REFRESHTOKEN_SECRET"),
    signOptions: {
      expiresIn: this.configService.get("JWT_REFRESHTOKEN_EXPIRES"),
    },
  };

  public get jwtAccessTokenSignOption(): JwtSignOptions {
    return this._jwtAccessTokenSignOption;
  }

  public get jwtAccessTokenVerifyOption(): JwtVerifyOptions {
    return this._jwtAccessTokenVerifyOption;
  }

  public get jwtRefreshTokenSignOption(): JwtSignOptions {
    return this._jwtRefreshTokenSignOption;
  }

  public get jwtRefreshTokenVerifyOption(): JwtVerifyOptions {
    return this._jwtRefreshTokenVerifyOption;
  }

  public get jwtAccessTokenModuleOption(): JwtModuleOptions {
    return this._jwtAccessTokenModuleOption;
  }

  public get jwtRefreshTokenModuleOption(): JwtModuleOptions {
    return this._jwtRefreshTokenModuleOption;
  }

  public get jwtAccessTokenForJwtModule(): JwtModuleAsyncOptions {
    return {
      useFactory: () => this.jwtAccessTokenModuleOption,
    };
  }

  public get jwtRefreshTokenForJwtModule(): JwtModuleAsyncOptions {
    return {
      useFactory: () => this.jwtRefreshTokenModuleOption,
    };
  }
}
