import { JwtAccessTokenPayload } from "../../auth/jwt/jwt-access-token-payload.interface";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../providers/user.repository";
import { AuthService } from "../../auth/providers/auth.service";
import { UserEntity } from "../entities/user.entity";

import * as bcrypt from "bcrypt";
import { PromiseLibrary } from "src/common/lib/promise.library";

@Injectable()
export class UserService {
  constructor(
    private readonly promiseLibrary: PromiseLibrary,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { nickname, email, password, phonenumber } = registerUserDto;

    await this.promiseLibrary.threePromiseBundle(
      this.userRepository.verifyUserEmail(email),
      this.userRepository.verifyUserNickName(nickname),
      this.userRepository.verifyUserPhoneNumber(phonenumber),
      "Check User Column For Register",
    );

    const hashed = await bcrypt.hash(password, 10);
    await this.userRepository.createUser(registerUserDto, hashed);
  }

  async findSelfInfoWithId(userId: string): Promise<UserEntity> {
    return await this.userRepository.findUserProfileInfoWithId(userId);
  }

  async patchUserInfoMyself(
    patchUserDto: PatchUserDto,
    userId: string,
  ): Promise<string> {
    const { nickname, phonenumber } = patchUserDto;
    const user = await this.userRepository.findUserWithId(userId);
    const myNickName = user.Auth.nickname;
    const myPhoneNumber = user.Profile.phonenumber;

    await this.promiseLibrary.twoPromiseBundle(
      this.userRepository.verifyUserNickNameWhenUpdate(myNickName, nickname),
      this.userRepository.verifyUserPhoneNumberWhenUpdate(
        myPhoneNumber,
        phonenumber,
      ),
      "Check User Column For Patch User Info",
    );

    const { password } = patchUserDto;
    const hashed = await bcrypt.hash(password, 10);

    await this.userRepository.patchUser(patchUserDto, hashed, userId);

    const jwtPayload: JwtAccessTokenPayload = {
      userId,
      nickname: patchUserDto.nickname,
    };

    return await this.authService.refreshToken(jwtPayload);
  }

  async deleteUserWithId(userId: string): Promise<void> {
    const existUser = await this.userRepository.isExistUser(userId);

    if (!existUser) {
      throw new NotFoundException("해당 아이디의 사용자를 찾을 수 없습니다.");
    }

    await this.userRepository.deleteUser(userId);
  }
}
