import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { RepositoryLayerErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class UserVerifyRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    private readonly repositoryErrorHandler: RepositoryLayerErrorHandleLibrary,
  ) {
    super();
  }

  async isExistUserId(userId: string): Promise<boolean> {
    try {
      const result = await this.userRepository.exist({ where: { id: userId } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistUserId.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async isExistUserEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.exist({ where: { email } });
      return result ? true : false;
    } catch (err) {
      this.methodName = this.isExistUserEmail.name;
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }

  async isNotExistUserEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.exist({ where: { email } });
      return result ? false : true;
    } catch (err) {
      this.methodName = this.isNotExistUserEmail.name;
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserProfileEntity>(
        new UserProfileEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserProfileEntity>(
        new UserProfileEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<UserProfileEntity>(
        new UserProfileEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
