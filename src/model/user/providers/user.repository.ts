import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserActivityEntity } from "../entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { Promises } from "../../../common/config/etc/providers/promises";
import { ReturnPropertyWithSelect } from "src/common/config/etc/etc.variable";

@Injectable()
export class UserRepository {
  constructor(
    private readonly promises: Promises,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserActivityEntity)
    private readonly userActivityRepository: Repository<UserActivityEntity>,
  ) {}

  private readonly select = ReturnPropertyWithSelect;

  async checkUserEmail(email: string): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.Profile", "Profile")
      .leftJoinAndSelect("user.Auth", "Auth")
      .leftJoinAndSelect("user.Activity", "Activity")
      .where("Auth.email = :email", { email })
      .getOne();

    if (found) {
      throw new UnauthorizedException("해당 이메일은 사용중입니다.");
    }
  }

  async checkUserNickName(nickname: string): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.Profile", "Profile")
      .leftJoinAndSelect("user.Auth", "Auth")
      .leftJoinAndSelect("user.Activity", "Activity")
      .where("Auth.nickname = :nickname", { nickname })
      .getOne();

    if (found) {
      throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
    }
  }

  async checkUserPhoneNumber(phonenumber: string): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.Profile", "Profile")
      .leftJoinAndSelect("user.Auth", "Auth")
      .leftJoinAndSelect("user.Activity", "Activity")
      .where("Profile.phonenumber = :phonenumber", { phonenumber })
      .getOne();

    if (found) {
      throw new UnauthorizedException("해당 전화번호는 사용중입니다.");
    }
  }

  async checkUserNickNameWhenUpdate(
    myNickName: string,
    nickNameToUpdate: string,
  ): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.Profile", "Profile")
      .leftJoinAndSelect("user.Auth", "Auth")
      .leftJoinAndSelect("user.Activity", "Activity")
      .where("Auth.nickname = :nickname", { nickname: nickNameToUpdate })
      .getOne();

    // 찾은 닉네임이 없다는 것은 DB에 중복되는 닉네임이 없다는 뜻
    if (!found) return;
    // 찾은 닉네임과 본인 닉네임이 같으면 사용 가능함
    else if (found.Auth.nickname === myNickName) return;
    // 이미 다른 사용자가 닉네임을 사용중임
    throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
  }

  async checkUserPhoneNumberWhenUpdate(
    myPhoneNumber: string,
    phoneNumberToUpdate: string,
  ): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.Profile", "Profile")
      .leftJoinAndSelect("user.Auth", "Auth")
      .leftJoinAndSelect("user.Activity", "Activity")
      .where("Profile.phonenumber = :phoennumber", {
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
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.Profile", "Profile")
        .leftJoinAndSelect("user.Auth", "Auth")
        .leftJoinAndSelect("user.Activity", "Activity")
        .leftJoinAndSelect("Activity.Review", "Review")
        .leftJoinAndSelect("Activity.Inquiry", "Inquiry")
        .where("user.id = :id", { id: userId })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 사용자아이디는 존재하지 않습니다.");
    }
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.Profile", "Profile")
        .leftJoinAndSelect("user.Auth", "Auth")
        .leftJoinAndSelect("user.Activity", "Activity")
        .where("Auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 이메일은 존재하지 않습니다.");
    }
  }

  async findUserWithNickName(nickname: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.Profile", "Profile")
        .leftJoinAndSelect("user.Auth", "Auth")
        .leftJoinAndSelect("user.Activity", "Activity")
        .where("Auth.nickname = :nickname", { nickname })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 닉네임은 존재하지 않습니다.");
    }
  }

  async findUserProfileInfoWithId(userId: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoin("user.Profile", "Profile")
      .select(["Profile.realname"])
      // .leftJoinAndSelect("user.Auth", "Auth")
      // .leftJoinAndSelect("user.Activity", "Activity")
      // .select(this.select.UserInformationReturnProperty)
      .where("user.id = :id", { id: userId })
      .getOne();

    console.log(this.select.UserInformationReturnProperty);

    return user;
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

    const saveUserColumn = await Promise.allSettled([
      this.userProfileRepository.save({ ...userProfileColumn }),
      this.userAuthRepository.save({ ...userAuthColumn }),
      this.userActivityRepository.save({ ...userActivityColumn }),
    ]);

    const [userProfile, userAuth, userActivity] =
      this.promises.threePromiseSettled(
        saveUserColumn[0],
        saveUserColumn[1],
        saveUserColumn[2],
        "Save User Column For Register",
      );

    const profileId = userProfile.id;
    const authId = userAuth.id;
    const activityId = userActivity.id;

    const findUserObject = await Promise.allSettled([
      this.userProfileRepository
        .createQueryBuilder("profile")
        .where("profile.id = :id", { id: profileId })
        .getOne(),
      this.userAuthRepository
        .createQueryBuilder("auth")
        .where("auth.id = :id", { id: authId })
        .getOne(),
      this.userActivityRepository
        .createQueryBuilder("activity")
        .where("activity.id = :id", { id: activityId })
        .getOne(),
    ]);

    const [userProfileObject, userAuthObject, userActivityObject] =
      this.promises.threePromiseSettled(
        findUserObject[0],
        findUserObject[1],
        findUserObject[2],
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
    userId: string,
  ): Promise<void> {
    const { realname, birth, gender, phonenumber, nickname } = patchUserDto;
    const user = await this.findUserWithId(userId);

    const { Profile, Auth } = user;

    Profile.realname = realname;
    Profile.birth = birth;
    Profile.gender = gender;
    Profile.phonenumber = phonenumber;
    Auth.nickname = nickname;
    Auth.password = hashed;

    const saveObject = await Promise.allSettled([
      this.userProfileRepository.save(Profile),
      this.userAuthRepository.save(Auth),
    ]);

    this.promises.twoPromiseSettled(
      saveObject[0],
      saveObject[1],
      "Save Object For Patch User Info",
    );
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.findUserWithId(userId);

    const userProfileId = user.Profile.id;
    const userAuthId = user.Auth.id;
    const userActivityId = user.Activity.id;

    const deleteObject = await Promise.allSettled([
      this.userRepository.delete({ id: userId }),
      this.userProfileRepository.delete(userProfileId),
      this.userAuthRepository.delete(userAuthId),
      this.userActivityRepository.delete(userActivityId),
    ]);

    this.promises.fourPromiseSettled(
      deleteObject[0],
      deleteObject[1],
      deleteObject[2],
      deleteObject[3],
      "Delete Object For Secession User",
    );
  }

  async increaseReviewCount(user: UserEntity) {
    user.Activity.productReviewCount++;
    await this.userRepository.save(user);
  }

  async increaseInquiryCount(user: UserEntity) {
    user.Activity.productInquiryCount++;
    await this.userRepository.save(user);
  }
}
