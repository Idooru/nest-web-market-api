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
import { Promises } from "../../../common/config/etc/providers/functions";

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

  async checkUserEmail(email: string): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("user.auth", "auth")
      .leftJoinAndSelect("user.activity", "activity")
      .where("auth.email = :email", { email })
      .getOne();

    if (found) {
      throw new UnauthorizedException("해당 이메일은 사용중입니다.");
    }
  }

  async checkUserNickName(nickname: string): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("user.auth", "auth")
      .leftJoinAndSelect("user.activity", "activity")
      .where("auth.nickname = :nickname", { nickname })
      .getOne();

    if (found) {
      throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
    }
  }

  async checkUserPhoneNumber(phonenumber: string): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("user.auth", "auth")
      .leftJoinAndSelect("user.activity", "activity")
      .where("profile.phonenumber = :phonenumber", { phonenumber })
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
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("user.auth", "auth")
      .leftJoinAndSelect("user.activity", "activity")
      .where("auth.nickname = :nickname", { nickname: nickNameToUpdate })
      .getOne();

    // 찾은 닉네임이 없다는 것은 DB에 중복되는 닉네임이 없다는 뜻
    if (!found) return;
    // 찾은 닉네임과 본인 닉네임이 같으면 사용 가능함
    else if (found.auth.nickname === myNickName) return;
    // 이미 다른 사용자가 닉네임을 사용중임
    throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
  }

  async checkUserPhoneNumberWhenUpdate(
    myPhoneNumber: string,
    phoneNumberToUpdate: string,
  ): Promise<void> {
    const found = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .leftJoinAndSelect("user.auth", "auth")
      .leftJoinAndSelect("user.activity", "activity")
      .where("profile.phonenumber = :phoennumber", {
        phonenumber: phoneNumberToUpdate,
      })
      .getOne();

    // 찾은 전화번호가 없다는 것은 DB에 중복되는 전화번호가 없다는 뜻
    if (!found) return;
    // 찾은 전화번호와 본인 전화번호가 같으면 사용 가능함
    else if (found.profile.phonenumber === myPhoneNumber) return;
    // 이미 다른 사용자가 전화번호를 사용중임
    throw new UnauthorizedException("해당 전화번호는 사용중입니다.");
  }

  async findUserWithId(userId: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("user.auth", "auth")
        .leftJoinAndSelect("user.activity", "activity")
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
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("user.auth", "auth")
        .leftJoinAndSelect("user.activity", "activity")
        .where("auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 이메일은 존재하지 않습니다.");
    }
  }

  async findUserWithNickName(nickname: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("user.auth", "auth")
        .leftJoinAndSelect("user.activity", "activity")
        .where("auth.nickname = :nickname", { nickname })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 닉네임은 존재하지 않습니다.");
    }
  }

  async findUserProfileInfoWithId(userId: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder("user")
      .innerJoin("user.profile", "profile")
      .select(["user.profile.realname"])
      .where("user.id = :id", { id: userId })
      .getOne();
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

    const saveUserColumnResult = this.promises.threePromiseSettled(
      saveUserColumn[0],
      saveUserColumn[1],
      saveUserColumn[2],
      "Save User Column For Register",
    );

    const [userProfile, userAuth, userActivity] = saveUserColumnResult;
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

    const findUserObjectResult = this.promises.threePromiseSettled(
      findUserObject[0],
      findUserObject[1],
      findUserObject[2],
      "Find User Object For Register",
    );

    const [userProfileObject, userAuthObject, userActivityObject] =
      findUserObjectResult;

    const createUserDto: CreateUserDto = {
      profile: userProfileObject,
      auth: userAuthObject,
      activity: userActivityObject,
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

    const { profile, auth } = user;

    profile.realname = realname;
    profile.birth = birth;
    profile.gender = gender;
    profile.phonenumber = phonenumber;
    auth.nickname = nickname;
    auth.password = hashed;

    const saveObject = await Promise.allSettled([
      this.userProfileRepository.save(profile),
      this.userAuthRepository.save(auth),
    ]);

    this.promises.twoPromiseSettled(
      saveObject[0],
      saveObject[1],
      "Save Object For Patch User Info",
    );
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.findUserWithId(userId);

    const userProfileId = user.profile.id;
    const userAuthId = user.auth.id;
    const userActivityId = user.activity.id;

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
}
