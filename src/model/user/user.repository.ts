import { PatchUserDto } from "./dtos/patch-user.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./dtos/register-user.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async checkUserEmail(email: string) {
    const found = await this.userRepository.findOne({ email });

    if (found) {
      throw new UnauthorizedException("해당 이메일은 사용중입니다.");
    }
  }

  async checkUserNickName(nickName: string) {
    const found = await this.userRepository.findOne({ nickName });

    if (found) {
      throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
    }
  }

  async checkUserPhoneNumber(phoneNumber: string) {
    const userPhoneNumber = await this.userRepository.findOne({
      phoneNumber,
    });

    if (userPhoneNumber) {
      throw new UnauthorizedException("해당 전화번호는 사용중입니다.");
    }
  }

  async isExistUserWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({ id });
    } catch (err) {
      throw new UnauthorizedException("해당 사용자아이디는 존재하지 않습니다.");
    }
  }

  async isExistUserWithEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({ email });
    } catch (err) {
      throw new UnauthorizedException("해당 이메일은 존재하지 않습니다.");
    }
  }

  async isExistUserWithNickName(nickName: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({ nickName });
    } catch (err) {
      throw new UnauthorizedException("해당 닉네임은 존재하지 않습니다.");
    }
  }

  async createUser(
    registerUserDto: RegisterUserDto,
    hashed: string,
  ): Promise<void> {
    await this.userRepository.save({
      ...registerUserDto,
      password: hashed,
    });
  }

  async patchUser(
    patchUserDto: PatchUserDto,
    hashed: string,
    id: string,
  ): Promise<void> {
    const password = { password: hashed };
    const payload = { ...patchUserDto, ...password };
    await this.userRepository.update(id, payload);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
