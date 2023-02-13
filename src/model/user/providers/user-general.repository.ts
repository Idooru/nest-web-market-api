import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UserActivityEntity } from "../entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { userSelectProperty } from "src/common/config/repository-select-configs/user-select";
import { PromiseLibrary } from "src/common/lib/promise.library";
import { InternalServerErrorException } from "@nestjs/common/exceptions";

@Injectable()
export class UserGeneralRepository {
  constructor(
    private readonly promiseLibrary: PromiseLibrary,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserActivityEntity)
    private readonly userActivityRepository: Repository<UserActivityEntity>,
  ) {}

  private readonly select = userSelectProperty;
  private readonly logger = new Logger("Error");

  async verifyUserEmail(email: string): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder()
      .select(this.select.userSelect)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.Activity", "Activity")
      .where("Auth.email = :email", { email })
      .getOne();

    if (found) {
      throw new UnauthorizedException("해당 이메일은 사용중입니다.");
    }
  }

  async verifyUserNickName(nickname: string): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder()
      .select(this.select.userSelect)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.Activity", "Activity")
      .where("Auth.nickname = :nickname", { nickname })
      .getOne();

    if (found) {
      throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
    }
  }

  async verifyUserPhoneNumber(phonenumber: string): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder()
      .select(this.select.userSelect)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.Activity", "Activity")
      .where("Profile.phonenumber = :phonenumber", { phonenumber })
      .getOne();

    if (found) {
      throw new UnauthorizedException("해당 전화번호는 사용중입니다.");
    }
  }

  async verifyUserNickNameWhenUpdate(
    myNickName: string,
    nickNameToUpdate: string,
  ): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder()
      .select(this.select.userSelect)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.Activity", "Activity")
      .where("Auth.nickname = :nickname", { nickname: nickNameToUpdate })
      .getOne();

    // 찾은 닉네임이 없다는 것은 DB에 중복되는 닉네임이 없다는 뜻
    if (!found) return;
    // 찾은 닉네임과 본인 닉네임이 같으면 사용 가능함
    else if (found.Auth.nickname === myNickName) return;
    // 이미 다른 사용자가 닉네임을 사용중임
    throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
  }

  async verifyUserPhoneNumberWhenUpdate(
    myPhoneNumber: string,
    phoneNumberToUpdate: string,
  ): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder()
      .select(this.select.userSelect)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.Activity", "Activity")
      .where("Profile.phonenumber = :phonenumber", {
        phonenumber: phoneNumberToUpdate,
      })
      .getOne();

    // 찾은 전화번호가 없다는 것은 DB에 중복되는 전화번호가 없다는 뜻
    if (!found) return;
    // 찾은 전화번호와 본인 전화번호가 같으면 사용 가능함
    else if (found.Profile.phonenumber === myPhoneNumber) return;
    // 이미 다른 사용자가 전화번호를 사용중임
    throw new UnauthorizedException("해당 전화번호는 사용중입니다.");
  }

  async findUserWithId(userId: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.userSelectWithActivityProperty)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .leftJoin("Activity.Review", "Review")
        .leftJoin("Activity.Inquiry", "Inquiry")
        .where("user.id = :id", { id: userId })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 사용자아이디는 존재하지 않습니다.");
    }
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.userSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 이메일은 존재하지 않습니다.");
    }
  }

  async findUserWithNickName(nickname: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(this.select.userSelect)
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Auth.nickname = :nickname", { nickname })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 닉네임은 존재하지 않습니다.");
    }
  }

  async findUserProfileInfoWithId(userId: string): Promise<any> {
    return await this.userRepository
      .createQueryBuilder()
      .select(this.select.userProfileSelect)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.Activity", "Activity")
      .leftJoin("Activity.Review", "Review")
      .leftJoin("Activity.Inquiry", "Inquiry")
      .where("user.id = :id", { id: userId })
      .getOne();
  }

  async findUserWithRealName(realname: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(["user", "Auth"])
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Profile.realname = :realname", { realname })
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async findUserWithPhoneNumber(phonenumber: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(["user", "Auth"])
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Profile.phonenumber = :phonenumber", { phonenumber })
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  async resetPassword(userAuthId: string, hashed: string) {
    const password = { password: hashed };
    await this.userAuthRepository
      .createQueryBuilder()
      .update(UserAuthEntity)
      .set({ ...password })
      .where("id = :id", { id: userAuthId })
      .execute();
  }

  async createUser(
    registerUserDto: RegisterUserDto,
    hashed: string,
  ): Promise<void> {
    const password = hashed;
    const { realname, nickname, birth, gender, email, phonenumber } =
      registerUserDto;

    const userProfileColumn = { realname, birth, gender, phonenumber };
    const userAuthColumn = { nickname, email, password };
    const userActivityColumn = {};

    const [userProfile, userAuth, userActivity] =
      await this.promiseLibrary.threePromiseBundle(
        this.userProfileRepository.save({ ...userProfileColumn }),
        this.userAuthRepository.save({ ...userAuthColumn }),
        this.userActivityRepository.save({ ...userActivityColumn }),
        "Save User Column For Register",
      );

    const profileId = userProfile.id;
    const authId = userAuth.id;
    const activityId = userActivity.id;

    const [userProfileObject, userAuthObject, userActivityObject] =
      await this.promiseLibrary.threePromiseBundle(
        this.userProfileRepository
          .createQueryBuilder()
          .select("profile")
          .from(UserProfileEntity, "profile")
          .where("profile.id = :id", { id: profileId })
          .getOne(),
        this.userAuthRepository
          .createQueryBuilder()
          .select("auth")
          .from(UserAuthEntity, "auth")
          .where("auth.id = :id", { id: authId })
          .getOne(),
        this.userActivityRepository
          .createQueryBuilder()
          .select("activity")
          .from(UserActivityEntity, "activity")
          .where("activity.id = :id", { id: activityId })
          .getOne(),
        "Find User Object For Register",
      );

    const createUserDto: CreateUserDto = {
      Profile: userProfileObject,
      Auth: userAuthObject,
      Activity: userActivityObject,
    };
    await this.userRepository.save({ ...createUserDto });
  }

  async patchUser(
    patchUserDto: PatchUserDto,
    hashed: string,
    userProfileId: string,
    userAuthId: string,
  ): Promise<void> {
    const { realname, birth, gender, phonenumber, nickname, email } =
      patchUserDto;

    await this.promiseLibrary.twoPromiseBundle(
      this.userProfileRepository
        .createQueryBuilder()
        .update(UserProfileEntity)
        .set({ realname, birth, gender, phonenumber })
        .where("id = :id", { id: userProfileId })
        .execute(),
      this.userAuthRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ email, nickname, password: hashed })
        .where("id = :id", { id: userAuthId })
        .execute(),
      "Save Object For Patch User Info",
    );
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where("id = :id", { id: userId })
      .execute();
  }

  async findUsersAllFromLastest(): Promise<UserEntity[]> {
    return await this.userProfileRepository
      .createQueryBuilder()
      .select(this.select.userSimpleSelect)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.Activity", "Activity")
      .orderBy("user.createdAt", "DESC")
      .getMany();
  }

  async findUsersAllFromOldest(): Promise<UserEntity[]> {
    return await this.userActivityRepository
      .createQueryBuilder()
      .select(this.select.userSimpleSelect)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.Activity", "Activity")
      .orderBy("user.createdAt", "ASC")
      .getMany();
  }

  async increaseReviewCount(user: UserEntity) {
    ++user.Activity.productReviewCount;
    await this.userRepository.save(user);
  }

  async increaseInquiryCount(user: UserEntity) {
    ++user.Activity.productInquiryCount;
    await this.userRepository.save(user);
  }
}
