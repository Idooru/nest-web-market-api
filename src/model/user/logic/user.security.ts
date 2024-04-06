import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtPayload } from "src/model/auth/jwt/jwt-payload.interface";
import { LoginUserDto } from "../dtos/login-user.dto";
import { UserSearcher } from "./user.searcher";
import { loggerFactory } from "src/common/functions/logger.factory";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { SecurityLibrary } from "src/common/lib/security/security.library";
import { CatchCallbackFactoryLibrary } from "../../../common/lib/util/catch-callback-factory.library";
import { JwtErrorHandlerLibrary } from "../../../common/lib/jwt/jwt-error-handler.library";

import bcrypt from "bcrypt";
import { FindEmailDto } from "../dtos/find-email.dto";

@Injectable()
export class UserSecurity {
  constructor(
    private readonly userSearcher: UserSearcher,
    private readonly jwtService: JwtService,
    private readonly securityLibrary: SecurityLibrary,
    private readonly callbackFactory: CatchCallbackFactoryLibrary,
    private readonly jwtErrorHandlerLibrary: JwtErrorHandlerLibrary,
  ) {}

  public hashPassword(
    password: string,
    hasTransaction: boolean,
  ): Promise<string> {
    return bcrypt
      .hash(password, this.securityLibrary.hashSalt)
      .catch(this.callbackFactory.getCatchHashPasswordFunc(hasTransaction));
  }

  public async login(dto: LoginUserDto): Promise<JwtPayload> {
    const { email, password } = dto;

    const user = await this.userSearcher.findUserWithEmail(email);
    const compared =
      user &&
      (await bcrypt
        .compare(password, user.Auth.password)
        .catch(this.callbackFactory.getCatchComparePasswordFunc()));

    if (!compared) {
      const message = "아이디 혹은 비밀번호가 일치하지 않습니다.";
      loggerFactory("Authenticate").error(message);
      throw new BadRequestException(message);
    }

    const jwtAccessTokenPayload: JwtAccessTokenPayload = {
      userId: user.id,
      email: user.Auth.email,
      nickname: user.Auth.nickname,
      userRole: user.role,
    };

    const jwtRefreshTokenPayload: JwtRefreshTokenPayload = {
      ...jwtAccessTokenPayload,
      isRefreshToken: true,
    };

    const accessToken = await this.jwtService
      .signAsync(
        jwtAccessTokenPayload,
        this.securityLibrary.jwtAccessTokenSignOption,
      )
      .catch(this.jwtErrorHandlerLibrary.catchSignAccessTokenError);

    const refreshToken = await this.jwtService
      .signAsync(
        jwtRefreshTokenPayload,
        this.securityLibrary.jwtRefreshTokenSignOption,
      )
      .catch(this.jwtErrorHandlerLibrary.catchSignRefreshTokenError);

    return { accessToken, refreshToken };
  }

  public async refreshToken(
    jwtPaylaod: JwtRefreshTokenPayload,
  ): Promise<string> {
    const user = await this.userSearcher.findUserWithEmail(jwtPaylaod.email);

    const jwtAccessTokenPayload: JwtAccessTokenPayload = {
      userId: user.id,
      email: user.Auth.email,
      nickname: user.Auth.nickname,
      userRole: user.role,
    };

    return this.jwtService
      .signAsync(
        jwtAccessTokenPayload,
        this.securityLibrary.jwtAccessTokenSignOption,
      )
      .catch(this.jwtErrorHandlerLibrary.catchSignAccessTokenError);
  }

  public async findEmail(dto: FindEmailDto): Promise<string> {
    const user = await this.userSearcher.findUserForgotten(dto);

    return user.Auth.email;
  }
}
