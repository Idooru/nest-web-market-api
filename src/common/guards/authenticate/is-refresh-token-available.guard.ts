import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { loggerFactory } from "../../functions/logger.factory";
import { UserSecurity } from "../../../model/user/logic/user.security";
import { ValidateTokenLibrary } from "../../lib/security/validate-token.library";

@Injectable()
export class IsRefreshTokenAvailableGuard implements CanActivate {
  constructor(
    private readonly validateTokenLibrary: ValidateTokenLibrary,
    private readonly userSecurity: UserSecurity,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { refresh_token } = req.signedCookies;

    if (!refresh_token) {
      const message =
        "refresh_token이 없으므로 access_token을 재발급 받기 위한 작업을 할 수 없습니다.";
      loggerFactory("NoneRefreshToken").error(message);
      throw new UnauthorizedException(message);
    }

    const authorizedUser = await this.validateTokenLibrary.validateRefreshToken(
      refresh_token,
    );

    const result = await this.userSecurity.isRefreshTokenAvailable(
      authorizedUser.userId,
      refresh_token,
    );

    if (!result) {
      const message =
        "보유하신 refresh_token이 저장된 refresh_token과 값이 같지 않으므로 제발급 할 수 없습니다.";
      loggerFactory("AlterationRefreshToken").error(message);
      throw new UnauthorizedException(message);
    }

    req.user = authorizedUser;

    return true;
  }
}
