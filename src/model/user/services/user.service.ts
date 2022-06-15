import { JwtPayload } from "./../../../common/interfaces/jwt-payload.interface";
import { PatchUserDto } from "./../dtos/patch-user.dto";
import { RegisterUserDto } from "./../dtos/register-user.dto";
import { Injectable } from "@nestjs/common";
import { UserRepository } from "../user.repository";
import { ResponseUserDto } from "../dtos/response-user.dto";
import { UserReturnFilter } from "src/common/config/etc";
import { AuthService } from "src/model/auth/services/auth.service";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  private readonly userReturnFilter = UserReturnFilter;

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { nickName, email, password, phoneNumber } = registerUserDto;

    await this.userRepository.checkUserEmail(email);
    await this.userRepository.checkUserNickName(nickName);
    await this.userRepository.checkUserPhoneNumber(phoneNumber);

    const hashed = await bcrypt.hash(password, 10);
    await this.userRepository.createUser(registerUserDto, hashed);
  }

  async findSelfInfoWithId(id: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.isExistUserWithId(id);
    return this.userReturnFilter(user);
  }

  async patchUserAndVerifyToken(
    patchUserDto: PatchUserDto,
    id: string,
  ): Promise<string> {
    const { password } = patchUserDto;
    const hashed = await bcrypt.hash(password, 10);
    await this.userRepository.patchUser(patchUserDto, hashed, id);

    const jwtPaylaod: JwtPayload = {
      id,
      email: patchUserDto.email,
      nickName: patchUserDto.nickName,
    };

    return await this.authService.refreshToken(jwtPaylaod);
  }

  async deleteUserWithId(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
