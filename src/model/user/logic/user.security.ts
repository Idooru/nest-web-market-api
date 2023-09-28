import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtPayload } from "src/model/auth/jwt/jwt-payload.interface";
import { LoginUserDto } from "../dtos/login-user.dto";
import { UserSearcher } from "./user.searcher";
import { loggerFactory } from "src/common/functions/logger.factory";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { v4 } from "uuid";
import { JwtService } from "@nestjs/jwt";
import { SecurityLibrary } from "src/common/lib/config/security.library";
import { UserEntity } from "../entities/user.entity";

import bcrypt from "bcrypt";

@Injectable()
export class UserSecurity {
  constructor(
    private readonly userSearcher: UserSearcher,
    private readonly jwtService: JwtService,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt
      .hash(password, this.securityLibrary.hashSalt)
      .catch((err: Error) => {
        loggerFactory("HashPassword").error(err);
        throw new InternalServerErrorException(err);
      });
  }

  async signToken(user: UserEntity): Promise<JwtPayload> {
    const jwtAccessTokenPayload: JwtAccessTokenPayload = {
      userId: user.id,
      email: user.Auth.email,
      nickname: user.Auth.nickname,
      userRole: user.role,
    };

    const jwtRefreshTokenPayload: JwtRefreshTokenPayload = {
      ...jwtAccessTokenPayload,
      isRefreshToken: true,
      randomToken: v4(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        jwtAccessTokenPayload,
        this.securityLibrary.jwtAccessTokenSignOption,
      ),
      this.jwtService.signAsync(
        jwtRefreshTokenPayload,
        this.securityLibrary.jwtRefreshTokenSignOption,
      ),
    ]).catch((err: Error) => {
      loggerFactory("JwtTokenSign").error(err);
      throw new InternalServerErrorException(err);
    });

    return { accessToken, refreshToken };
  }

  async login(loginUserDto: LoginUserDto): Promise<JwtPayload> {
    const { email, password } = loginUserDto;

    const user = await this.userSearcher.findUserWithEmail(email);

    if (!user) {
      const message = "아이디 혹은 비밀번호가 일치하지 않습니다.";
      loggerFactory("Authenticate").error(message);
      throw new BadRequestException(message);
    }

    const isValidPw = await bcrypt
      .compare(password, user.Auth.password)
      .catch((err: Error) => {
        loggerFactory("ComparePassword").error(err);
        throw new InternalServerErrorException(err);
      });

    if (!isValidPw) {
      const message = "아이디 혹은 비밀번호가 일치하지 않습니다.";
      loggerFactory("Authenticate").error(message);
      throw new BadRequestException(message);
    }

    return this.signToken(user);
  }

  async refreshToken(jwtPaylaod: JwtRefreshTokenPayload): Promise<JwtPayload> {
    const user = await this.userSearcher.findUserWithEmail(jwtPaylaod.email);
    return await this.signToken(user);
  }

  async findEmail(realname: string, phonenumber: string): Promise<string> {
    const user = await this.userSearcher.findUserForgotten(
      realname,
      phonenumber,
    );

    return user.Auth.email;
  }
}
