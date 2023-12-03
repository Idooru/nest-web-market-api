import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { JwtPayload } from "src/model/auth/jwt/jwt-payload.interface";
import { LoginUserDto } from "../dtos/login-user.dto";
import { UserSearcher } from "./user.searcher";
import { loggerFactory } from "src/common/functions/logger.factory";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { SecurityLibrary } from "src/common/lib/security/security.library";
import { CatchCallbackFactoryLibrary } from "../../../common/lib/util/catch-callback-factory.library";
import { UserUpdateService } from "../services/user-update.service";
import { JwtErrorHandlerLibrary } from "../../../common/lib/util/jwt-error-handler.library";

import bcrypt from "bcrypt";

@Injectable()
export class UserSecurity {
  constructor(
    private readonly userSearcher: UserSearcher,
    private readonly jwtService: JwtService,
    private readonly securityLibrary: SecurityLibrary,
    private readonly callbackFactory: CatchCallbackFactoryLibrary,
    @Inject(forwardRef(() => UserUpdateService))
    private readonly userUpdateService: UserUpdateService,
    private readonly jwtErrorHandlerLibrary: JwtErrorHandlerLibrary,
  ) {}

  async hashPassword(
    password: string,
    hasTransaction: boolean,
  ): Promise<string> {
    return await bcrypt
      .hash(password, this.securityLibrary.hashSalt)
      .catch(this.callbackFactory.getCatchHashPasswordFunc(hasTransaction));
  }

  async login(loginUserDto: LoginUserDto): Promise<JwtPayload> {
    const { email, password } = loginUserDto;

    const user = await this.userSearcher.findUserWithEmail(email);

    if (user.Auth.refreshToken) {
      const message = "이미 로그인한 계정입니다.";
      loggerFactory("AlreadyLogin").error(message);
      throw new ForbiddenException(message);
    }

    if (!user) {
      const message = "아이디 혹은 비밀번호가 일치하지 않습니다.";
      loggerFactory("Authenticate").error(message);
      throw new BadRequestException(message);
    }

    const isValidPw = await bcrypt
      .compare(password, user.Auth.password)
      .catch(this.callbackFactory.getCatchComparePasswordFunc());

    if (!isValidPw) {
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

    await this.userUpdateService.initRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }

  async isRefreshTokenAvailable(
    id: string,
    myRefreshToken: string,
  ): Promise<boolean> {
    const { refreshToken } = await this.userSearcher.findRefreshTokenWithId(id);
    return myRefreshToken === refreshToken;
  }

  async refreshToken(jwtPaylaod: JwtRefreshTokenPayload): Promise<string> {
    const user = await this.userSearcher.findUserWithEmail(jwtPaylaod.email);

    const jwtAccessTokenPayload: JwtAccessTokenPayload = {
      userId: user.id,
      email: user.Auth.email,
      nickname: user.Auth.nickname,
      userRole: user.role,
    };

    return await this.jwtService
      .signAsync(
        jwtAccessTokenPayload,
        this.securityLibrary.jwtAccessTokenSignOption,
      )
      .catch(this.jwtErrorHandlerLibrary.catchSignAccessTokenError);
  }

  async findEmail(realname: string, phonenumber: string): Promise<string> {
    const user = await this.userSearcher.findUserForgotten(
      realname,
      phonenumber,
    );

    return user.Auth.email;
  }

  async logout(jwtPayload: JwtAccessTokenPayload): Promise<void> {
    await this.userUpdateService.removeRefreshToken(jwtPayload.userId);
  }
}
