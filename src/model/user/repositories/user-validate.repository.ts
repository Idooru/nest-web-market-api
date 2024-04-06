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

  public isExistId(id: string): Promise<boolean> {
    return this.userRepository.exist({ where: { id } });
  }

  public isExistClientUserId(id: string): Promise<boolean> {
    return this.clientUserRepository.exist({ where: { id } });
  }

  public isNoneExistEmail(email: string): Promise<boolean> {
    return this.userAuthRepository.exist({ where: { email } });
  }

  public isNoneExistNickname(nickname: string): Promise<boolean> {
    return this.userAuthRepository.exist({ where: { nickname } });
  }

  public isNoneExistPhonenumber(phonenumber: string): Promise<boolean> {
    return this.userProfileRepository.exist({
      where: { phonenumber },
    });
  }
}
