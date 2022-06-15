import { ResetPasswordDto } from "./../../user/dtos/reset-password.dto";
import { FindEmailDto } from "./../../user/dtos/find-email.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./../../user/dtos/login-user.dto";
import { UserRepository } from "./../../user/user.repository";
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";

import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositry: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(user: JwtPayload): Promise<string> {
    const jwtPayload = {
      id: user.id,
      email: user.email,
      nickName: user.nickName,
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
    const user = await this.userRepositry.findUserWithEmail(email);

    if (!user)
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    else if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }

    return await this.refreshToken(user);
  }

  async findEmail(findEmailDto: FindEmailDto): Promise<string> {
    const { birth, phoneNumber } = findEmailDto;

    const foundWithBirth = await this.userRepositry.findEmailWithBirth(birth);
    const foundWithPhoneNumber =
      await this.userRepositry.findEmailWithPhoneNumber(phoneNumber);

    if (!(foundWithBirth.id === foundWithPhoneNumber.id)) {
      throw new UnauthorizedException(
        "입력된 두 정보가 서로 일치하는 정보가 아닙니다.",
      );
    }

    return foundWithBirth.email;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, password } = resetPasswordDto;
    const user = await this.userRepositry.findUserWithEmail(email);

    if (!user) {
      throw new UnauthorizedException("이메일에 해당하는 아이디가 없습니다.");
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.userRepositry.resetPassword(email, hashed);
  }
}
