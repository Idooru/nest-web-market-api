import { JwtAccessTokenPayload } from "./jwt-access-token-payload.interface";
import { JwtRefreshTokenPayload } from "./jwt-refresh-token-payload.interface";

export interface JwtPayload {
  accessToken: JwtAccessTokenPayload;
  refreshToken: JwtRefreshTokenPayload;
}
