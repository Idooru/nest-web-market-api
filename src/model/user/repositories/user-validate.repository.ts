import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { Repository } from "typeorm";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserEntity } from "../entities/user.entity";
import { ClientUserEntity } from "../entities/client-user.entity";

@Injectable()
export class UserValidateRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(ClientUserEntity)
    private readonly clientUserRepository: Repository<ClientUserEntity>,
  ) {}

  public async isExistId(id: string): Promise<boolean> {
    return await this.userRepository.exist({ where: { id } });
  }

  public async isExistEmail(email: string): Promise<boolean> {
    return await this.userAuthRepository.exist({ where: { email } });
  }

  public async isExistNickname(nickname: string): Promise<boolean> {
    return await this.userAuthRepository.exist({ where: { nickname } });
  }

  public async isExistPhoneNumber(phonenumber: string): Promise<boolean> {
    return await this.userProfileRepository.exist({ where: { phonenumber } });
  }

  public async isExistClientUserId(id: string): Promise<boolean> {
    return await this.clientUserRepository.exist({ where: { id } });
  }

  public async isNoneExistEmail(email: string): Promise<boolean> {
    return await this.userAuthRepository.exist({ where: { email } });
  }

  public async isNoneExistNickname(nickname: string): Promise<boolean> {
    return await this.userAuthRepository.exist({ where: { nickname } });
  }

  public async isNoneExistPhonenumber(phonenumber: string): Promise<boolean> {
    return await this.userProfileRepository.exist({
      where: { phonenumber },
    });
  }
}
