import { PatchUserDto } from "../dtos/patch-user.dto";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserGeneralRepository } from "./user-general.repository";
import { UserEntity } from "../entities/user.entity";
import { PromiseLibrary } from "src/common/lib/promise.library";
import * as bcrypt from "bcrypt";
import { UserExistRepository } from "./user-exist.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly promiseLibrary: PromiseLibrary,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly userExistRepository: UserExistRepository,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { nickname, email, password, phonenumber } = registerUserDto;

    await this.promiseLibrary.threePromiseBundle(
      this.userGeneralRepository.verifyUserEmail(email),
      this.userGeneralRepository.verifyUserNickName(nickname),
      this.userGeneralRepository.verifyUserPhoneNumber(phonenumber),
      "Check User Column For Register",
    );

    const hashed = await bcrypt.hash(password, 10);
    await this.userGeneralRepository.createUser(registerUserDto, hashed);
  }

  async findSelfInfoWithId(userId: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findUserProfileInfoWithId(userId);
  }

  async patchUserInfoMyself(
    patchUserDto: PatchUserDto,
    userId: string,
  ): Promise<void> {
    const { nickname, phonenumber } = patchUserDto;
    const user = await this.userGeneralRepository.findUserWithId(userId);
    const myNickName = user.Auth.nickname;
    const myPhoneNumber = user.Profile.phonenumber;

    await this.promiseLibrary.twoPromiseBundle(
      this.userGeneralRepository.verifyUserNickNameWhenUpdate(
        myNickName,
        nickname,
      ),
      this.userGeneralRepository.verifyUserPhoneNumberWhenUpdate(
        myPhoneNumber,
        phonenumber,
      ),
      "Check User Column For Patch User Info",
    );

    const { password } = patchUserDto;
    const hashed = await bcrypt.hash(password, 10);

    await this.userGeneralRepository.patchUser(
      patchUserDto,
      hashed,
      user.Profile.id,
      user.Auth.id,
    );
  }

  async deleteUserWithId(userId: string): Promise<void> {
    const existUser = await this.userExistRepository.isExistUser(userId);

    if (!existUser) {
      throw new NotFoundException("해당 아이디의 사용자를 찾을 수 없습니다.");
    }

    await this.userGeneralRepository.deleteUser(userId);
  }

  async getUsersAllFromLastest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findUsersAllFromLastest();
  }

  async getUsersAllFromOldest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findUsersAllFromOldest();
  }

  async getUserById(userId: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findUserProfileInfoWithId(userId);
  }
}
