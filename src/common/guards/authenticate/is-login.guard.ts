import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { loggerFactory } from "../../functions/logger.factory";
import { ValidateTokenLibrary } from "../../lib/security/validate-token.library";
import { Implemented } from "../../decorators/implemented.decoration";

@Injectable()
export class IsLoginGuard implements CanActivate {
  constructor(private readonly validateTokenLibrary: ValidateTokenLibrary) {}

  @Implemented
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = req.signedCookies["access-token"];

    if (!accessToken) {
      const message = "access-token이 없으므로 인증이 필요한 작업을 수행할 수 없습니다.";
      loggerFactory("NoneAccessToken").error(message);
      throw new UnauthorizedException(message);
    }

    req.user = await this.validateTokenLibrary.validateAccessToken(accessToken);

    return true;
  }
}
