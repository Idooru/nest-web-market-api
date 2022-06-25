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

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly uploadService: UploadService,
  ) {}

  private readonly userReturnFilter = UserReturnFilter;

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { nickName, email, password, phoneNumber } = registerUserDto;

    const promises = await Promise.allSettled([
      this.userRepository.checkUserEmail(email),
      this.userRepository.checkUserNickName(nickName),
      this.userRepository.checkUserPhoneNumber(phoneNumber),
    ]);

    const errors = promises.filter((idx) => idx.status === "rejected");

    if (errors.length) throw new BadRequestException(errors, "Register Error");

    const hashed = await bcrypt.hash(password, 10);
    await this.userRepository.createUser(registerUserDto, hashed);
  }

  async findSelfInfoWithId(userId: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.isExistUserWithId(userId);

    // const uploadedImage = await this.uploadService.getImageFileNameWithUserId(
    //   userId,
    // );

    // await this.userRepository.insertImageForUser(userId, uploadedImage);

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
