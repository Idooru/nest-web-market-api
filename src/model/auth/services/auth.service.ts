import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { ResetPasswordDto } from "./../../user/dtos/reset-password.dto";
import { FindEmailDto } from "./../../user/dtos/find-email.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./../../user/dtos/login-user.dto";
import { AuthRepository } from "../auth.repository";
import { JwtPayload } from "../../../common/interfaces/jwt-payload.interface";

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
    const user = await this.authRepositry.findUserWithEmail(email);

    if (!(await bcrypt.compare(password, user.auth.password))) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }

    const jwtPayload = {
      id: user.id,
      email: user.auth.email,
      nickname: user.auth.nickname,
      userType: user.auth.userType,
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

    const promises = await Promise.allSettled([
      this.authRepositry.isExistUserWithRealName(realname),
      this.authRepositry.isExistUserWithPhoneNumber(phonenumber),
    ]);

    const errors = promises.filter(
      (idx: PromiseSettledResult<unknown>): idx is PromiseRejectedResult =>
        idx.status === "rejected",
    );

    if (errors.length) {
      throw new BadRequestException(errors, "Find Email Error");
    }

    const success = promises.filter(
      <T>(idx: PromiseSettledResult<T>): idx is PromiseFulfilledResult<T> =>
        idx.status === "fulfilled",
    );

    const [realnameResult, phonenumberResult] = success;

    if (!(realnameResult.value.id === phonenumberResult.value.id)) {
      throw new UnauthorizedException(
        "사용자 실명과 전화번호가 서로 일치하지 않습니다.",
      );
    }
    return realnameResult.value.auth.email;

    // const [realnameResult, phonenumberResult] = (await promises).map(
    //   (idx) => idx,
    // );
    // console.log(realnameResult, phonenumberResult);
    // const foundWithRealName = await this.authRepositry.isExistUserWithRealName(
    //   realname,
    // );

    // const foundWithPhoneNumber =
    //   await this.authRepositry.isExistUserWithPhoneNumber(phonenumber);

    // if (!foundWithRealName || !foundWithPhoneNumber) {
    //   throw new UnauthorizedException(
    //     "입력한 정보로는 사용자 정보를 불러올 수 없습니다.",
    //   );
    // }

    // if (!(foundWithRealName.id === foundWithPhoneNumber.id)) {

    // }

    // return foundWithRealName.email;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { email, password } = resetPasswordDto;
    const user = await this.authRepositry.findUserWithEmail(email);

    if (!user) {
      throw new UnauthorizedException("이메일에 해당하는 아이디가 없습니다.");
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.authRepositry.resetPassword(user.auth.id, hashed);
  }
}
