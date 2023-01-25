import { CookieOptions } from "express";
import { JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

// 기존에 new ConfigService().get("JWT_SECRET") 방식을 사용하여 JWT 비밀키를 불러왔었는데 어느 순간 부터 이 방식으로 비밀키를 요청하면 undefined를 반환하게 되었다. 그래서 ConfigModule을 임포트 한 후, ConfigService를 DI 한 후 사용해 봤는데 정상적으로 비밀키를 불러올 수 있게 되었다.
@Injectable()
export class SecurityLibrary {
  constructor(private readonly configService: ConfigService) {}

  private cookieOption: CookieOptions = {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + 100000000),
  };

  private jwtOption: JwtModuleOptions = {
    secret: this.configService.get("JWT_SECRET"),
  };

  public getCookieOption(): CookieOptions {
    return this.cookieOption;
  }

  public getJwtOption(): JwtModuleOptions {
    return this.jwtOption;
  }
}
