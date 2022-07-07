import { JwtPayload } from "../../../common/interfaces/jwt-payload.interface";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { Injectable } from "@nestjs/common";
import { UserRepository } from "../providers/user.repository";
import { ResponseUserDto } from "../dtos/response-user.dto";
import { UserReturnFilter } from "../dtos/response-user.dto";
import { AuthService } from "../../auth/providers/auth.service";
import { UploadService } from "src/model/upload/providers/upload.service";
import { Promises } from "src/model/etc/providers/promises";
import { UserEntity } from "../entities/user.entity";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private readonly promises: Promises,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { nickname, email, password, phonenumber } = registerUserDto;

    const CheckUserColumn = await Promise.allSettled([
      this.userRepository.checkUserEmail(email),
      this.userRepository.checkUserNickName(nickname),
      this.userRepository.checkUserPhoneNumber(phonenumber),
    ]);

    this.promises.twoPromiseSettled(
      CheckUserColumn[0],
      CheckUserColumn[1],
      "Check User Column For Register",
    );

    const hashed = await bcrypt.hash(password, 10);
    await this.userRepository.createUser(registerUserDto, hashed);
  }

  async findSelfInfoWithId(userId: string): Promise<UserEntity> {
    return await this.userRepository.findUserWithId(userId);
  }

  async patchUserInfoMyself(
    patchUserDto: PatchUserDto,
    userId: string,
  ): Promise<string> {
    const { nickname, phonenumber } = patchUserDto;
    const user = await this.userRepository.findUserWithId(userId);
    const myNickName = user.auth.nickname;
    const myPhoneNumber = user.profile.phonenumber;

    const checkUserColumn = await Promise.allSettled([
      this.userRepository.checkUserNickNameWhenUpdate(myNickName, nickname),
      this.userRepository.checkUserPhoneNumberWhenUpdate(
        myPhoneNumber,
        phonenumber,
      ),
    ]);

    this.promises.twoPromiseSettled(
      checkUserColumn[0],
      checkUserColumn[1],
      "Check User Column For Patch User Info",
    );

    const { password } = patchUserDto;
    const hashed = await bcrypt.hash(password, 10);
    await this.userRepository.patchUser(patchUserDto, hashed, userId);

    const jwtPaylaod: JwtPayload = {
      id: userId,
      nickname: patchUserDto.nickname,
    };

    return await this.authService.refreshToken(jwtPaylaod);
  }

  async deleteUserWithId(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }
}
