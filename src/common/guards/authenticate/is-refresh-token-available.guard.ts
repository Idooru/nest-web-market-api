import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { loggerFactory } from "../../functions/logger.factory";
import { ValidateTokenLibrary } from "../../lib/security/validate-token.library";
import { Implemented } from "../../decorators/implemented.decoration";
import { UserAuthEntity } from "../../../model/user/entities/user-auth.entity";
import { UserEntity } from "../../../model/user/entities/user.entity";
import { UserSearcher } from "../../../model/user/logic/user.searcher";

class EntityFinder {
  constructor(private readonly userIdFilter: string, private readonly userSearcher: UserSearcher) {}

  public findUser(userId: string): Promise<UserEntity> {
    return this.userSearcher.findEntity({
      property: this.userIdFilter,
      alias: { id: userId },
      getOne: true,
      entities: [UserAuthEntity],
    }) as Promise<UserEntity>;
  }
}

@Injectable()
export class IsRefreshTokenAvailableGuard implements CanActivate {
  private readonly entityFinder: EntityFinder;

  constructor(
    @Inject("user-id-filter")
    private readonly userIdFilter: string,
    private readonly userSearcher: UserSearcher,
    private readonly validateTokenLibrary: ValidateTokenLibrary,
  ) {
    this.entityFinder = new EntityFinder(this.userIdFilter, this.userSearcher);
  }

  @Implemented
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = req.signedCookies["access-token"];

    if (!accessToken) {
      const message = "access-token이 없으므로 access-token을 재발급 받기 위한 작업을 할 수 없습니다.";
      loggerFactory("NoneRefreshToken").error(message);
      throw new UnauthorizedException(message);
    }

    const payload = await this.validateTokenLibrary.decodeAccessToken(accessToken);
    const user = await this.entityFinder.findUser(payload.userId);

    const refreshToken = user.UserAuth.refreshToken;

    await this.validateTokenLibrary.validateRefreshToken(refreshToken);

    req.user = payload;
    return true;
  }
}
