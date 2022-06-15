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

  async findUserWithId(id: string): Promise<UserEntity[]> {
    try {
      const user = await this.userRepository.findByIds([id]);
      if (!user) throw new Error();
      return user;
    } catch (err) {
      throw new UnauthorizedException("해당 아이디는 존재하지 않습니다.");
    }
  }

  async patchUser(patchUserDto: PatchUserDto, id: string): Promise<void> {
    await this.userRepository.update(id, patchUserDto);
  }
}
