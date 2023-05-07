import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { TypeOrmErrorHandlerBuilder } from "src/common/lib/error-handler/typeorm-error-handler.builder";

@Injectable()
export class UserVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlerBuilder,
  ) {
    super();
  }

  async isExistUserId(userId: string): Promise<boolean> {
    try {
      const result = await this.userRepository.exist({ where: { id: userId } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistUserId.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(UserEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async isExistUserEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.exist({ where: { email } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistUserEmail.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(UserAuthEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async isNotExistUserEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.exist({ where: { email } });
      return result ? false : true;
    } catch (err) {
      this.methodName = this.isNotExistUserEmail.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(UserAuthEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async isExistUserRealName(realname: string): Promise<boolean> {
    try {
      const result = await this.userProfileRepository.exist({
        where: { realname },
      });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistUserRealName.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(UserAuthEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async isNotExistUserNickName(nickname: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.exist({
        where: { nickname },
      });
      return result ? false : true;
    } catch (err) {
      this.methodName = this.isNotExistUserNickName.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(UserAuthEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async isExistUserPhoneNumber(phonenumber: string): Promise<boolean> {
    try {
      const result = await this.userProfileRepository.exist({
        where: { phonenumber },
      });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistUserPhoneNumber.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(UserProfileEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }

  async isNotExistUserPhoneNumber(phonenumber: string): Promise<boolean> {
    try {
      const result = await this.userProfileRepository.exist({
        where: { phonenumber },
      });
      return result ? false : true;
    } catch (err) {
      this.methodName = this.isNotExistUserPhoneNumber.name;
      this.typeOrmErrorHandlerBuilder
        .setEntity(UserProfileEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
