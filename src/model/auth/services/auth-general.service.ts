import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ResetPasswordDto } from "../../user/dtos/reset-password.dto";
import { FindEmailDto } from "../../user/dtos/find-email.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "../../user/dtos/login-user.dto";
import { UserEntity } from "src/model/user/entities/user.entity";
import { SecurityLibrary } from "src/common/lib/security.library";
import { JwtPayload } from "../jwt/jwt-payload.interface";
import { JwtRefreshTokenPayload } from "../jwt/jwt-refresh-token-payload.interface";
import { v4 } from "uuid";
import { AuthExistService } from "./auth-exist.service";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import * as bcrypt from "bcrypt";

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
    const isExistEmail = await this.authExistService.verfiyEmail(email);

    if (isExistEmail) {
      const user = await this.userGeneralRepository.findUserWithEmail(email);

      if (
        await this.authExistService.verfiyPassword(password, user.Auth.password)
      ) {
        return user;
      }
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }
    throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
  }

  async signToken(user: UserEntity): Promise<JwtPayload> {
    const jwtAccessTokenPayload = {
      userId: user.id,
      email: user.Auth.email,
      nickname: user.Auth.nickname,
      userType: user.Auth.userType,
    };

    const jwtRefreshTokenPayload = {
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

    const [isExistRealName, isExistPhoneNumber] =
      await this.authExistService.verfiyRealNameAndPhoneNumber(
        realname,
        phonenumber,
      );

    if (isExistRealName && isExistPhoneNumber) {
      const [realNameResult, phoneNumberResult] = await Promise.all([
        this.userGeneralRepository.findUserWithRealName(realname),
        this.userGeneralRepository.findUserWithPhoneNumber(phonenumber),
      ]);

      if (realNameResult.id === phoneNumberResult.id) {
        return realNameResult.Auth.email;
      }
      throw new UnauthorizedException(
        "사용자 실명과 전화번호가 서로 일치하지 않습니다.",
      );
    }
    throw new NotFoundException(
      "해당 데이터(실명, 전화번호)는 데이터베이스에 존재하지 않습니다.",
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, password } = resetPasswordDto;
    const isExistEmail = await this.authExistService.verfiyEmail(email);

    if (isExistEmail) {
      const user = await this.userGeneralRepository.findUserWithEmail(email);

      const hashed = await bcrypt.hash(password, 10);
      return await this.userGeneralRepository.resetPassword(
        user.Auth.id,
        hashed,
      );
    }
    throw new NotFoundException(
      "해당 데이터(이메일)은 데이터베이스에 존재하지 않습니다.",
    );
  }
}
