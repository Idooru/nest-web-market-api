import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SecurityLibrary } from "./security.library";
import { JwtAccessTokenPayload } from "../../../model/auth/jwt/jwt-access-token-payload.interface";
import { JwtRefreshTokenPayload } from "../../../model/auth/jwt/jwt-refresh-token-payload.interface";
import { JwtErrorHandlerLibrary } from "../jwt/jwt-error-handler.library";

@Injectable()
export class ValidateTokenLibrary {
  constructor(
    private readonly jwtService: JwtService,
    private readonly securityLibrary: SecurityLibrary,
    private readonly jwtErrorHandlerLibrary: JwtErrorHandlerLibrary,
  ) {}

  public async validateAccessToken(accessToken: string): Promise<JwtAccessTokenPayload> {
    return this.jwtService
      .verifyAsync(accessToken, this.securityLibrary.jwtAccessTokenVerifyOption)
      .catch(this.jwtErrorHandlerLibrary.catchVerifyAccessTokenError);
  }

  public async validateRefreshToken(refreshToken: string): Promise<JwtRefreshTokenPayload> {
    return this.jwtService
      .verifyAsync(refreshToken, this.securityLibrary.jwtRefreshTokenVerifyOption)
      .catch(this.jwtErrorHandlerLibrary.catchVerifyRefreshTokenError);
  }
}
