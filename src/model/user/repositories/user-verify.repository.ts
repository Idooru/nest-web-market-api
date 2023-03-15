import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { RepositoryLogger } from "src/common/classes/repository.logger";

@Injectable()
export class UserVerifyRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
  ) {
    super("User Verify");
  }

  async isExistUserId(userId: string): Promise<boolean> {
    try {
      const result = await this.userRepository.exist({ where: { id: userId } });
      return result ? true : false;
    } catch (err) {
      this.logger.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isExistUserEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.exist({ where: { email } });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isNotExistUserEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.exist({ where: { email } });
      return result ? false : true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isExistUserRealName(realname: string): Promise<boolean> {
    try {
      const result = await this.userProfileRepository.exist({
        where: { realname },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isNotExistUserNickName(nickname: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.exist({
        where: { nickname },
      });
      return result ? false : true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isExistUserPhoneNumber(phonenumber: string): Promise<boolean> {
    try {
      const result = await this.userProfileRepository.exist({
        where: { phonenumber },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isNotExistUserPhoneNumber(phonenumber: string): Promise<boolean> {
    try {
      const result = await this.userProfileRepository.exist({
        where: { phonenumber },
      });
      return result ? false : true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
