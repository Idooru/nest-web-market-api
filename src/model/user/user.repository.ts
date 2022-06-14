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

  async findUserWithEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ email });
  }

  async findUserWithNickName(nickName: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ nickName });
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

  async findUserWithId(id: string) {
    return await this.userRepository.findByIds([id]);
  }
}
