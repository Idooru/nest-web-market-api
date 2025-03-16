import { BadRequestException, Injectable } from "@nestjs/common";
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
import { UserUpdateRepository } from "../repositories/user-update.repository";

@Injectable()
export class UserSecurity {
  constructor(
    private readonly userSearcher: UserSearcher,
    private readonly jwtService: JwtService,
    private readonly securityLibrary: SecurityLibrary,
    private readonly callbackFactory: CatchCallbackFactoryLibrary,
    private readonly jwtErrorHandlerLibrary: JwtErrorHandlerLibrary,
    private readonly userUpdateRepository: UserUpdateRepository,
  ) {}

  public hashPassword(password: string, hasTransaction: boolean): Promise<string> {
    return bcrypt
      .hash(password, this.securityLibrary.hashSalt)
      .catch(this.callbackFactory.getCatchHashPasswordFunc(hasTransaction));
  }

  public async login(dto: LoginUserDto): Promise<string> {
    const { email, password } = dto;

    const user = await this.userSearcher.findUserWithEmail(email);
    const compared =
      user &&
      (await bcrypt.compare(password, user.Auth.password).catch(this.callbackFactory.getCatchComparePasswordFunc()));

    if (!compared) {
      const message = "아이디 혹은 비밀번호가 일치하지 않습니다.";
      loggerFactory("Authenticate").error(message);
      throw new BadRequestException(message);
    }

    const jwtAccessTokenPayload: JwtAccessTokenPayload = {
      userId: user.id,
      email: user.Auth.email,
      nickName: user.Auth.nickName,
      userRole: user.role,
    };

    const jwtRefreshTokenPayload: JwtRefreshTokenPayload = {
      ...jwtAccessTokenPayload,
      isRefreshToken: true,
    };

    const accessToken = await this.jwtService
      .signAsync(jwtAccessTokenPayload, this.securityLibrary.jwtAccessTokenSignOption)
      .catch(this.jwtErrorHandlerLibrary.catchSignAccessTokenError);

    const refreshToken = await this.jwtService
      .signAsync(jwtRefreshTokenPayload, this.securityLibrary.jwtRefreshTokenSignOption)
      .catch(this.jwtErrorHandlerLibrary.catchSignRefreshTokenError);

    await this.userUpdateRepository.setRefreshToken(user.id, refreshToken);

    return accessToken;
  }

  public async refreshToken(id: string): Promise<string> {
    const user = await this.userSearcher.findUserWithId(id);

    const jwtAccessTokenPayload: JwtAccessTokenPayload = {
      userId: user.id,
      email: user.Auth.email,
      nickName: user.Auth.nickName,
      userRole: user.role,
    };

    return this.jwtService
      .signAsync(jwtAccessTokenPayload, this.securityLibrary.jwtAccessTokenSignOption)
      .catch(this.jwtErrorHandlerLibrary.catchSignAccessTokenError);
  }

  public async logout(id: string): Promise<void> {
    await this.userUpdateRepository.removeRefreshToken(id);
  }

  public async findForgottenEmail(dto: FindEmailDto): Promise<string> {
    const user = await this.userSearcher.findForgottenEmail(dto);

    return user.Auth.email;
  }
}
