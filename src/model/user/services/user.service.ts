import { RegisterUserDto } from "./../dtos/register-user.dto";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { UnauthorizedException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { UserRepository } from "../user.repository";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { nickName, email, password } = registerUserDto;

    const isExistEmail = await this.userRepository.existEmail(email);

    if (isExistEmail) {
      throw new UnauthorizedException("해당 이메일은 사용중입니다.");
    }

    const isExistNickName = await this.userRepository.existNickName(nickName);

    if (isExistNickName) {
      throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.createUser(registerUserDto, hashed);

    return user;
  }
}
