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
import { Implemented } from "../../decorators/implemented.decoration";

@Injectable()
export class IsRefreshTokenAvailableGuard implements CanActivate {
  constructor(
    private readonly validateTokenLibrary: ValidateTokenLibrary,
    private readonly userSecurity: UserSecurity,
  ) {}
  @Implemented
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { refresh_token } = req.signedCookies;

    if (!refresh_token) {
      const message =
        "refresh_token이 없으므로 access_token을 재발급 받기 위한 작업을 할 수 없습니다.";
      loggerFactory("NoneRefreshToken").error(message);
      throw new UnauthorizedException(message);
    }

    req.user = await this.validateTokenLibrary.validateRefreshToken(
      refresh_token,
    );

    return true;
  }
}
