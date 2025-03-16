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

  public validateId(id: string): Promise<boolean> {
    return this.userRepository.exist({ where: { id } });
  }

  public validateClientUserId(id: string): Promise<boolean> {
    return this.clientUserRepository.exist({ where: { id } });
  }

  public validateEmail(email: string): Promise<boolean> {
    return this.userAuthRepository.exist({ where: { email } });
  }

  public validateRealName(realName: string): Promise<boolean> {
    return this.userProfileRepository.exist({ where: { realName } });
  }

  public validateNickName(nickName: string): Promise<boolean> {
    return this.userAuthRepository.exist({ where: { nickName } });
  }

  public validatePhoneNumber(phoneNumber: string): Promise<boolean> {
    return this.userProfileRepository.exist({ where: { phoneNumber } });
  }
}
