import { RegisterUserDto } from "./../dtos/register-user.dto";
import { UnauthorizedException, Injectable } from "@nestjs/common";
import { UserRepository } from "../user.repository";
import { ResponseUserDto } from "../dtos/response-user.dto";
import { UserReturnFilter } from "src/common/config/etc";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly userReturnFilter = UserReturnFilter;

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { nickName, email, password } = registerUserDto;

    const isfindUserWithEmail = await this.userRepository.findUserWithEmail(
      email,
    );

    if (isfindUserWithEmail) {
      throw new UnauthorizedException("해당 이메일은 사용중입니다.");
    }

    const isfindUserWithNickName =
      await this.userRepository.findUserWithNickName(nickName);

    if (isfindUserWithNickName) {
      throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.userRepository.createUser(registerUserDto, hashed);
  }

  async findSelfInfoWithId(id: string): Promise<ResponseUserDto[]> {
    const user = await this.userRepository.findUserWithId(id);
    const readOnlyUser = user.map((user) => this.userReturnFilter(user));

    return readOnlyUser;
  }
}
