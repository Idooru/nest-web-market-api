import { JwtPayload } from "./../../../common/interfaces/jwt-payload.interface";
import { PatchUserDto } from "./../dtos/patch-user.dto";
import { RegisterUserDto } from "./../dtos/register-user.dto";
import { Injectable, BadRequestException } from "@nestjs/common";
import { UserRepository } from "../user.repository";
import { ResponseUserDto } from "../dtos/response-user.dto";
import { UserReturnFilter } from "../dtos/response-user.dto";
import { AuthService } from "../../auth/services/auth.service";

import * as bcrypt from "bcrypt";
import { UploadService } from "src/model/upload/services/upload.service";
import { Functions } from "src/model/etc/providers/functions";

@Injectable()
export class UserService {
  constructor(
    private readonly functions: Functions,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly uploadService: UploadService,
  ) {}

  private readonly userReturnFilter = UserReturnFilter;

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { nickname, email, password, phonenumber } = registerUserDto;

    const promiseForCheckUserColumn = await Promise.allSettled([
      this.userRepository.checkUserEmail(email),
      this.userRepository.checkUserNickName(nickname),
      this.userRepository.checkUserPhoneNumber(phonenumber),
    ]);

    this.functions.promiseSettledProcess(
      promiseForCheckUserColumn,
      "Check User Column For Register",
    );

    const hashed = await bcrypt.hash(password, 10);
    await this.userRepository.createUser(registerUserDto, hashed);
  }

  async findSelfInfoWithId(userId: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findUserWithId(userId);

    // const uploadedImage = await this.uploadService.getImageFileNameWithUserId(
    //   userId,
    // );

    // await this.userRepository.insertImageForUser(userId, uploadedImage);

    return this.userReturnFilter(user);
  }

  async patchUserInfoMyself(
    patchUserDto: PatchUserDto,
    userId: string,
  ): Promise<string> {
    const { nickname, phonenumber } = patchUserDto;
    const myInfo = await this.findSelfInfoWithId(userId);
    const myNickName = myInfo.nickname;
    const myPhoneNumber = myInfo.phonenumber;

    const promisesForCheckUserColumn = await Promise.allSettled([
      this.userRepository.checkUserNickNameWhenUpdate(myNickName, nickname),
      this.userRepository.checkUserPhoneNumberWhenUpdate(
        myPhoneNumber,
        phonenumber,
      ),
    ]);

    this.functions.promiseSettledProcess(
      promisesForCheckUserColumn,
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
