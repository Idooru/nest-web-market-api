import { UserEntity } from "./../../user/entities/user.entity";
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

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email, password } = loginUserDto;
    const user: UserEntity = await this.userRepositry.findUserWithEmail(email);

    if (!user)
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }

    const jwtPayload: JwtPayload = {
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
}
