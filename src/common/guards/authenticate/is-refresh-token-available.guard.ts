import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { loggerFactory } from "../../functions/logger.factory";
import { ValidateTokenLibrary } from "../../lib/security/validate-token.library";
import { Implemented } from "../../decorators/implemented.decoration";
import { UserSearchRepository } from "../../../model/user/repositories/user-search.repository";

@Injectable()
export class IsRefreshTokenAvailableGuard implements CanActivate {
  constructor(
    private readonly validateTokenLibrary: ValidateTokenLibrary,
    private readonly repository: UserSearchRepository,
  ) {}

  @Implemented
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = req.signedCookies["access-token"];

    if (!accessToken) {
      const message = "refresh-token이 없으므로 access-token을 재발급 받기 위한 작업을 할 수 없습니다.";
      loggerFactory("NoneRefreshToken").error(message);
      throw new UnauthorizedException(message);
    }

    const payload = await this.validateTokenLibrary.decodeAccessToken(accessToken);
    const refreshToken = await this.repository.findRefreshToken(payload.userId);

    await this.validateTokenLibrary.validateRefreshToken(refreshToken);

    req.user = payload;
    return true;
  }
}
