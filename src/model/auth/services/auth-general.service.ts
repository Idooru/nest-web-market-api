import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ResetPasswordDto } from "../../user/dtos/reset-password.dto";
import { FindEmailDto } from "../../user/dtos/find-email.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "../../user/dtos/login-user.dto";
import { SecurityLibrary } from "src/common/lib/security.library";
import { JwtPayload } from "../jwt/jwt-payload.interface";
import { JwtRefreshTokenPayload } from "../jwt/jwt-refresh-token-payload.interface";
import { v4 } from "uuid";
import { AuthExistService } from "./auth-exist.service";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { UserEntity } from "src/model/user/entities/user.entity";
import * as bcrypt from "bcrypt";
import { JwtAccessTokenPayload } from "../jwt/jwt-access-token-payload.interface";

@Injectable()
export class AuthGeneralService {
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly authExistService: AuthExistService,
    private readonly securityLibrary: SecurityLibrary,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(jwtPayload: JwtRefreshTokenPayload): Promise<JwtPayload> {
    const user = await this.userGeneralRepository.findUserWithEmail(
      jwtPayload.email,
    );

    return await this.signToken(user);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    const isExistUserEmail = await this.authExistService.verifyEmail(email);

    if (isExistUserEmail) {
      const user = await this.userGeneralRepository.findUserWithEmail(email);

      if (
        await this.authExistService.verifyPassword(password, user.Auth.password)
      ) {
        return user;
      }
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }
    throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
  }

  async signToken(user: UserEntity): Promise<JwtPayload> {
    const jwtAccessTokenPayload: JwtAccessTokenPayload = {
      userId: user.id,
      email: user.Auth.email,
      nickname: user.Auth.nickname,
      userType: user.type,
    };

    const jwtRefreshTokenPayload: JwtRefreshTokenPayload = {
      ...jwtAccessTokenPayload,
      isRefreshToken: true,
      randomToken: v4(),
    };

    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          jwtAccessTokenPayload,
          this.securityLibrary.getJwtAceessTokenSignOption(),
        ),
        this.jwtService.signAsync(
          jwtRefreshTokenPayload,
          this.securityLibrary.getJwtRefreshTokenSignOption(),
        ),
      ]);

      return { accessToken, refreshToken };
    } catch (err) {
      new Logger("Error").error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findEmail(findEmailDto: FindEmailDto): Promise<string> {
    const { realname, phonenumber } = findEmailDto;

    const [realNameResult, phoneNumberResult] = await Promise.all([
      this.userGeneralRepository.findUserWithRealName(realname),
      this.userGeneralRepository.findUserWithPhoneNumber(phonenumber),
    ]);

    if (realNameResult === null || phoneNumberResult === null) {
      throw new UnauthorizedException(
        "사용자 실명과 전화번호가 서로 일치하지 않습니다.",
      );
    } else if (realNameResult.id !== phoneNumberResult.id) {
      throw new UnauthorizedException(
        "사용자 실명과 전화번호가 서로 일치하지 않습니다.",
      );
    }

    return realNameResult.Auth.email;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, password } = resetPasswordDto;

    const user = await this.userGeneralRepository.findUserWithEmail(email);

    const hashed = await bcrypt.hash(password, 10);
    await this.userGeneralRepository.resetPassword(user.Auth.id, hashed);
  }
}
