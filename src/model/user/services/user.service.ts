import { JwtPayload } from "./../../../common/interfaces/jwt-payload.interface";
import { PatchUserDto } from "./../dtos/patch-user.dto";
import { RegisterUserDto } from "./../dtos/register-user.dto";
import { UnauthorizedException, Injectable } from "@nestjs/common";
import { UserRepository } from "../user.repository";
import { ResponseUserDto } from "../dtos/response-user.dto";
import { UserReturnFilter } from "src/common/config/etc";
import { AuthService } from "src/model/auth/services/auth.service";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private readonly userReturnFilter = UserReturnFilter;

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { nickName, email, password } = registerUserDto;

    const isExistUserEmail = await this.userRepository.findUserWithEmail(email);

    if (isExistUserEmail) {
      throw new UnauthorizedException("해당 이메일은 사용중입니다.");
    }

    const isExistUserNickName = await this.userRepository.findUserWithNickName(
      nickName,
    );

    if (isExistUserNickName) {
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

  async patchUser(patchUserDto: PatchUserDto, id: string): Promise<void> {
    const { password } = patchUserDto;
    const user = await this.userRepository.patchUser(patchUserDto, id);

    const jwtToken = await this.authService.refreshToken(jwtPayload);
  }
}
