import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SecurityLibrary } from "./security.library";
import { CatchCallbackFactoryLibrary } from "../util/catch-callback-factory.library";
import { JwtAccessTokenPayload } from "../../../model/auth/jwt/jwt-access-token-payload.interface";
import { JwtRefreshTokenPayload } from "../../../model/auth/jwt/jwt-refresh-token-payload.interface";

@Injectable()
export class ValidateTokenLibrary {
  constructor(
    private readonly jwtService: JwtService,
    private readonly securityLibrary: SecurityLibrary,
    private readonly callbackFactory: CatchCallbackFactoryLibrary,
  ) {}

  public async validateAccessToken(
    accessToken: string,
  ): Promise<JwtAccessTokenPayload> {
    return await this.jwtService
      .verifyAsync(accessToken, this.securityLibrary.jwtAccessTokenVerifyOption)
      .catch(this.callbackFactory.getCatchJwtTokenVerifyFunc());
  }

  public async validateRefreshToken(
    refreshToken: string,
  ): Promise<JwtRefreshTokenPayload> {
    return await this.jwtService
      .verifyAsync(
        refreshToken,
        this.securityLibrary.jwtRefreshTokenVerifyOption,
      )
      .catch(this.callbackFactory.getCatchJwtTokenVerifyFunc());
  }
}
