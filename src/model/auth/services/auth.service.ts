import { ResetPasswordDto } from "./../../user/dtos/reset-password.dto";
import { FindEmailDto } from "./../../user/dtos/find-email.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./../../user/dtos/login-user.dto";
import { AuthRepository } from "../auth.repository";
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
    private readonly authRepositry: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(user: JwtPayload): Promise<string> {
    const jwtPayload = {
      id: user.id,
      email: user.email,
      nickName: user.nickName,
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
    const user = await this.authRepositry.findUserWithEmail(email);

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }

    return await this.refreshToken(user);
  }

  async findEmail(findEmailDto: FindEmailDto): Promise<string> {
    const { realName, phoneNumber } = findEmailDto;

    const foundWithRealName = await this.authRepositry.isExistUserWithRealName(
      realName,
    );

    const foundWithPhoneNumber =
      await this.authRepositry.isExistUserWithPhoneNumber(phoneNumber);

    if (!foundWithRealName || !foundWithPhoneNumber) {
      throw new UnauthorizedException("올바르지 않은 정보입니다.");
    }

    if (!(foundWithRealName.id === foundWithPhoneNumber.id)) {
      throw new UnauthorizedException("올바르지 않은 정보입니다.");
    }

    return foundWithRealName.email;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, password } = resetPasswordDto;
    const user = await this.authRepositry.findUserWithEmail(email);

    if (!user) {
      throw new UnauthorizedException("이메일에 해당하는 아이디가 없습니다.");
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.authRepositry.resetPassword(user.id, hashed);
  }
}
