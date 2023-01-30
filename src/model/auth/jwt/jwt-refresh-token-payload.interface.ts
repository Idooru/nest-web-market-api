import { JwtAccessTokenPayload } from "./jwt-access-token-payload.interface";

export interface JwtRefreshTokenPayload extends JwtAccessTokenPayload {
  isRefreshToken: boolean;
}
