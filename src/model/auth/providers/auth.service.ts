import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ResetPasswordDto } from "../../user/dtos/reset-password.dto";
import { FindEmailDto } from "../../user/dtos/find-email.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "../../user/dtos/login-user.dto";
import { AuthRepository } from "./auth.repository";
import { PromiseLibrary } from "src/common/lib/promise.library";
import { UserEntity } from "src/model/user/entities/user.entity";
import { SecurityLibrary } from "src/common/lib/security.library";
import { JwtPayload } from "../jwt/jwt-payload.interface";
import * as bcrypt from "bcrypt";
import { v4 } from "uuid";
import { JwtRefreshTokenPayload } from "../jwt/jwt-refresh-token-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly promiseLibrary: PromiseLibrary,
    private readonly securityLibrary: SecurityLibrary,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(jwtPayload: JwtRefreshTokenPayload): Promise<JwtPayload> {
    const user = await this.authRepository.findUserWithEmail(jwtPayload.email);

    return await this.signToken(user);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    const user = await this.authRepository.findUserWithEmail(email);

    if (!(await bcrypt.compare(password, user.Auth.password))) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }

    return user;
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
      const [accessToken, refreshToken] =
        await this.promiseLibrary.twoPromiseBundle(
          this.jwtService.signAsync(
            jwtAccessTokenPayload,
            this.securityLibrary.getJwtAceessTokenSignOption(),
          ),
          this.jwtService.signAsync(
            jwtRefreshTokenPayload,
            this.securityLibrary.getJwtRefreshTokenSignOption(),
          ),
          "Sign jwt token access and refresh",
        );

      return { accessToken, refreshToken };
    } catch (err) {
      throw new InternalServerErrorException(
        "JWT 토큰을 발행하는데 실패하였습니다.",
      );
    }
  }

  async findEmail(findEmailDto: FindEmailDto): Promise<string> {
    const { realname, phonenumber } = findEmailDto;

    const [realNameResult, phoneNumberResult] =
      await this.promiseLibrary.twoPromiseBundle(
        this.authRepository.findUserWithRealName(realname),
        this.authRepository.findUserWithPhoneNumber(phonenumber),
        "Check User Column For Find Email",
      );

    if (!(realNameResult.id === phoneNumberResult.id)) {
      throw new UnauthorizedException(
        "사용자 실명과 전화번호가 서로 일치하지 않습니다.",
      );
    }

    return realNameResult.Auth.email;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, password } = resetPasswordDto;

    const [user, hashed] = await this.promiseLibrary.twoPromiseBundle(
      this.authRepository.findUserWithEmail(email),
      bcrypt.hash(password, 10),
      "Find User And Hash Password",
    );

    await this.authRepository.resetPassword(user.Auth.id, hashed);
  }
}
