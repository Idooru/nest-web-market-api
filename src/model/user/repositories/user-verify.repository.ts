import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { UserAuthEntity } from "../entities/user.auth.entity";

@Injectable()
export class UserVerifyRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userVerifyRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileVerifyRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthVerifyRepository: Repository<UserAuthEntity>,
  ) {}

  private readonly logger = new Logger("Error");

  async isExistUserId(userId: string): Promise<boolean> {
    try {
      const result = await this.userVerifyRepository.findOne({
        where: { id: userId },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isExistUserEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthVerifyRepository.findOne({
        where: { email },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isNotExistUserEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthVerifyRepository.findOne({
        where: { email },
      });
      return result ? false : true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isExistUserRealName(realname: string): Promise<boolean> {
    try {
      const result = await this.userProfileVerifyRepository.findOne({
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
      const result = await this.userAuthVerifyRepository.findOne({
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
      const result = await this.userProfileVerifyRepository.findOne({
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
      const result = await this.userProfileVerifyRepository.findOne({
        where: { phonenumber },
      });
      return result ? false : true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
