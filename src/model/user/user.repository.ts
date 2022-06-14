import { Injectable } from "@nestjs/common";
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

  async existEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ email });
  }

  async existNickName(nickName: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ nickName });
  }

  async createUser(
    registerUserDto: RegisterUserDto,
    hashed: string,
  ): Promise<UserEntity> {
    return await this.userRepository.save({
      ...registerUserDto,
      password: hashed,
    });
  }
}
