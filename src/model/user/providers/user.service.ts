import { JwtPayload } from "../../../common/interfaces/jwt.payload.interface";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../providers/user.repository";
import { AuthService } from "../../auth/providers/auth.service";
import { PromisesLibrary } from "../../../common/lib/promises.library";
import { UserEntity } from "../entities/user.entity";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private readonly promisesLibrary: PromisesLibrary,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { nickname, email, password, phonenumber } = registerUserDto;

    const [CheckUserColumnOne, CheckUserColumnTwo, CheckUserColumnThree] =
      await Promise.allSettled([
        this.userRepository.verifyUserEmail(email),
        this.userRepository.verifyUserNickName(nickname),
        this.userRepository.verifyUserPhoneNumber(phonenumber),
      ]);

    this.promisesLibrary.threePromiseSettled(
      CheckUserColumnOne,
      CheckUserColumnTwo,
      CheckUserColumnThree,
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

    const checkUserColumn = await Promise.allSettled([
      this.userRepository.verifyUserNickNameWhenUpdate(myNickName, nickname),
      this.userRepository.verifyUserPhoneNumberWhenUpdate(
        myPhoneNumber,
        phonenumber,
      ),
    ]);

    this.promisesLibrary.twoPromiseSettled(
      checkUserColumn[0],
      checkUserColumn[1],
      "Check User Column For Patch User Info",
    );

    const { password } = patchUserDto;
    const hashed = await bcrypt.hash(password, 10);
    await this.userRepository.patchUser(patchUserDto, hashed, userId);

    const jwtPayload: JwtPayload = {
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
