import { Injectable, Logger } from "@nestjs/common";
import { UserActivityEntity } from "../entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { ModifyUserDto } from "../dtos/modify-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { userSelectProperty } from "src/common/config/repository-select-configs/user-select";
import { InternalServerErrorException } from "@nestjs/common/exceptions";

@Injectable()
export class UserGeneralRepository {
  private readonly select = userSelectProperty;
  private readonly logger = new Logger("Repository");

  constructor(
    @InjectRepository(UserEntity)
    private readonly userGeneralRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileGeneralRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthGeneralRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserActivityEntity)
    private readonly userActivityGeneralRepository: Repository<UserActivityEntity>,
  ) {}

  async findUserWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.userSelectWithActivityProperty)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .leftJoin("Activity.Review", "Review")
        .leftJoin("Activity.Inquiry", "Inquiry")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.userSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithNickName(nickname: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.userSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Auth.nickname = :nickname", { nickname })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserProfileInfoWithId(id: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.userProfileSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .leftJoin("Activity.Review", "Review")
        .leftJoin("Activity.Inquiry", "Inquiry")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Inquiry.Image", "InquiryImage")
        .leftJoin("Inquiry.Video", "InquiryVideo")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserInfoFromAdmin(id: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(this.select.userSelectWhoAdmin)
        .from(UserEntity, "user")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .leftJoin("Activity.Review", "Review")
        .leftJoin("Activity.Inquiry", "Inquiry")
        .where("user.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithRealName(realname: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(["user", "Auth"])
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Profile.realname = :realname", { realname })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserWithPhoneNumber(phonenumber: string): Promise<UserEntity> {
    try {
      return await this.userGeneralRepository
        .createQueryBuilder()
        .select(["user", "Auth"])
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Profile.phonenumber = :phonenumber", { phonenumber })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async resetPassword(id: string, hashed: string) {
    try {
      const password = { password: hashed };
      await this.userAuthGeneralRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ ...password })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async createUser(
    registerUserDto: RegisterUserDto,
    hashed: string,
  ): Promise<void> {
    try {
      const password = hashed;
      const { realname, nickname, birth, gender, email, phonenumber } =
        registerUserDto;

      const userProfileColumn = { realname, birth, gender, phonenumber };
      const userAuthColumn = { nickname, email, password };
      const userActivityColumn = {};

      const [userProfile, userAuth, userActivity] = await Promise.all([
        this.userProfileGeneralRepository.save({ ...userProfileColumn }),
        this.userAuthGeneralRepository.save({ ...userAuthColumn }),
        this.userActivityGeneralRepository.save({ ...userActivityColumn }),
      ]);

      const profileId = userProfile.id;
      const authId = userAuth.id;
      const activityId = userActivity.id;

      const [userProfileObject, userAuthObject, userActivityObject] =
        await Promise.all([
          this.userProfileGeneralRepository
            .createQueryBuilder()
            .select("profile")
            .from(UserProfileEntity, "profile")
            .where("profile.id = :id", { id: profileId })
            .getOne(),
          this.userAuthGeneralRepository
            .createQueryBuilder()
            .select("auth")
            .from(UserAuthEntity, "auth")
            .where("auth.id = :id", { id: authId })
            .getOne(),
          this.userActivityGeneralRepository
            .createQueryBuilder()
            .select("activity")
            .from(UserActivityEntity, "activity")
            .where("activity.id = :id", { id: activityId })
            .getOne(),
        ]);

      const createUserDto: CreateUserDto = {
        Profile: userProfileObject,
        Auth: userAuthObject,
        Activity: userActivityObject,
      };
      await this.userGeneralRepository.save({ ...createUserDto });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUser(
    modifyUserDto: ModifyUserDto,
    password: string,
    userProfileId: string,
    userAuthId: string,
  ): Promise<void> {
    try {
      const { phonenumber, nickname, email } = modifyUserDto;

      await Promise.all([
        this.userProfileGeneralRepository
          .createQueryBuilder()
          .update(UserProfileEntity)
          .set({ phonenumber })
          .where("id = :id", { id: userProfileId })
          .execute(),
        this.userAuthGeneralRepository
          .createQueryBuilder()
          .update(UserAuthEntity)
          .set({ email, nickname, password })
          .where("id = :id", { id: userAuthId })
          .execute(),
      ]);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUserEmail(email: string, id: string): Promise<void> {
    try {
      await this.userAuthGeneralRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ email })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUserNickName(nickname: string, id: string): Promise<void> {
    try {
      await this.userAuthGeneralRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ nickname })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUserPhoneNumber(phonenumber: string, id: string): Promise<void> {
    try {
      await this.userProfileGeneralRepository
        .createQueryBuilder()
        .update(UserProfileEntity)
        .set({ phonenumber })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyUserPassword(password: string, id: string): Promise<void> {
    try {
      await this.userAuthGeneralRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ password })
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.userGeneralRepository
        .createQueryBuilder()
        .delete()
        .from(UserEntity)
        .where("id = :id", { id: userId })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUsersAllFromLastest(): Promise<UserEntity[]> {
    try {
      return await this.userProfileGeneralRepository
        .createQueryBuilder()
        .select(this.select.userSimpleSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .orderBy("user.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUsersAllFromOldest(): Promise<UserEntity[]> {
    try {
      return await this.userActivityGeneralRepository
        .createQueryBuilder()
        .select(this.select.userSimpleSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .orderBy("user.createdAt", "ASC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async increaseReviewCount(user: UserEntity): Promise<void> {
    try {
      ++user.Activity.productReviewCount;
      await this.userGeneralRepository.save(user);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async increaseInquiryCount(user: UserEntity): Promise<void> {
    try {
      ++user.Activity.productInquiryCount;
      await this.userGeneralRepository.save(user);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async decreaseReviewCount(user: UserEntity): Promise<void> {
    try {
      --user.Activity.productReviewCount;
      await this.userGeneralRepository.save(user);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async decreaseInquiryCount(user: UserEntity): Promise<void> {
    try {
      --user.Activity.productInquiryCount;
      await this.userGeneralRepository.save(user);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
