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
export class UserExistRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
  ) {}

  private readonly logger = new Logger("Error");

  async isExistUser(userId: string): Promise<boolean> {
    try {
      return !!(await this.userRepository.findOne(userId));
    } catch (err) {
      this.logger.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async isExistRealName(realname: string): Promise<boolean> {
    try {
      return !!(await this.userProfileRepository.findOne({
        where: { realname },
      }));
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async isExistPhoneNumber(phonenumber: string): Promise<boolean> {
    try {
      return !!(await this.userProfileRepository.findOne({
        where: { phonenumber },
      }));
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async isExistEmail(email: string): Promise<boolean> {
    try {
      return !!(await this.userAuthRepository.findOne({
        where: { email },
      }));
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
