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
  private readonly logger = new Logger("Error");

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
  ) {}

  async isExistUserId(userId: string): Promise<boolean> {
    try {
      const result = await this.userRepository.findOne({
        where: { id: userId },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isExistRealName(realname: string): Promise<boolean> {
    try {
      const result = await this.userProfileRepository.findOne({
        where: { realname },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isExistPassword(hashed: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.findOne({
        where: { password: hashed },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isExistEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.findOne({
        where: { email },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isNotExistEmail(email: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.findOne({
        where: { email },
      });
      return result ? false : true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isNotExistNickName(nickname: string): Promise<boolean> {
    try {
      const result = await this.userAuthRepository.findOne({
        where: { nickname },
      });
      return result ? false : true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isExistPhoneNumber(phonenumber: string): Promise<boolean> {
    try {
      const result = await this.userProfileRepository.findOne({
        where: { phonenumber },
      });
      return result ? true : false;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async isNotExistPhoneNumber(phonenumber: string): Promise<boolean> {
    try {
      const result = await this.userProfileRepository.findOne({
        where: { phonenumber },
      });
      return result ? false : true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
