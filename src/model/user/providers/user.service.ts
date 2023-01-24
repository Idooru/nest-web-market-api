import { JwtPayload } from "../../../common/interfaces/jwt.payload.interface";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { Injectable } from "@nestjs/common";
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
        this.userRepository.checkUserEmail(email),
        this.userRepository.checkUserNickName(nickname),
        this.userRepository.checkUserPhoneNumber(phonenumber),
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
      this.userRepository.checkUserNickNameWhenUpdate(myNickName, nickname),
      this.userRepository.checkUserPhoneNumberWhenUpdate(
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
    await this.userRepository.deleteUser(userId);
  }
}
