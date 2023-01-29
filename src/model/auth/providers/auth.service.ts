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
import { JwtPayload } from "../jwt/jwt.payload.interface";

import * as bcrypt from "bcrypt";
import { PromiseLibrary } from "src/common/lib/promise.library";

@Injectable()
export class AuthService {
  constructor(
    private readonly promiseLibrary: PromiseLibrary,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(user: JwtPayload): Promise<string> {
    const jwtPayload = {
      userId: user.userId,
      email: user.email,
      nickname: user.nickname,
      userType: user.userType,
    };

    try {
      return await this.jwtService.signAsync(jwtPayload);
    } catch (err) {
      throw new InternalServerErrorException(
        "JWT 토큰을 발행하는데 실패하였습니다.",
      );
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email, password } = loginUserDto;
    const user = await this.authRepository.findUserWithEmail(email);

    if (!(await bcrypt.compare(password, user.Auth.password))) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }

    const jwtPayload = {
      userId: user.id,
      email: user.Auth.email,
      nickname: user.Auth.nickname,
      userType: user.Auth.userType,
    };

    try {
      return await this.jwtService.signAsync(jwtPayload);
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

    const resultPromise = await this.promiseLibrary.twoPromiseBundle(
      this.authRepository.findUserWithEmail(email),
      bcrypt.hash(password, 10),
      "Find User And Hash Password",
    );

    const [user, hashed] = resultPromise;

    await this.authRepository.resetPassword(user.Auth.id, hashed);
  }
}
