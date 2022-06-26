import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserActivityEntity } from "./entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserCommonEntity } from "./entities/user.common.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { UserCoreEntity } from "./entities/user.core.entity";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UserObjects } from "src/common/config/etc";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserCoreEntity)
    private readonly userRepository: Repository<UserCoreEntity>,
    @InjectRepository(UserCommonEntity)
    private readonly userCommonRepository: Repository<UserCommonEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserActivityEntity)
    private readonly userActivityRepository: Repository<UserActivityEntity>,
  ) {}

  async checkUserEmail(email: string): Promise<void> {
    const found = await this.userRepository.findOne({
      where: { auth: { email } },
      relations: UserObjects,
    });

    if (found) {
      throw new UnauthorizedException("해당 이메일은 사용중입니다.");
    }
  }

  async checkUserNickName(nickname: string): Promise<void> {
    const found = await this.userRepository.findOne({
      where: { auth: { nickname } },
      relations: UserObjects,
    });

    if (found) {
      throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
    }
  }

  async checkUserPhoneNumber(phonenumber: string): Promise<void> {
    const found = await this.userRepository.findOne({
      where: { common: { phonenumber } },
      relations: UserObjects,
    });

    if (found) {
      throw new UnauthorizedException("해당 전화번호는 사용중입니다.");
    }
  }

  async checkUserNickNameWhenUpdate(
    myNickName: string,
    nickNameToUpdate: string,
  ): Promise<void> {
    const found = await this.userRepository.findOne({
      where: { auth: { nickname: nickNameToUpdate } },
      relations: UserObjects,
    });

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
    const found = await this.userRepository.findOne({
      where: { common: { phonenumber: phoneNumberToUpdate } },
      relations: UserObjects,
    });

    // 찾은 전화번호가 없다는 것은 DB에 중복되는 전화번호가 없다는 뜻
    if (!found) return;
    // 찾은 전화번호와 본인 전화번호가 같으면 사용 가능함
    else if (found.common.phonenumber === myPhoneNumber) return;
    // 이미 다른 사용자가 전화번호를 사용중임
    throw new UnauthorizedException("해당 전화번호는 사용중입니다.");
  }

  async isExistUserWithId(userId: string): Promise<UserCoreEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id: userId },
        relations: UserObjects,
      });
    } catch (err) {
      throw new UnauthorizedException("해당 사용자아이디는 존재하지 않습니다.");
    }
  }

  async isExistUserWithEmail(email: string): Promise<UserCoreEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { auth: { email } },
        relations: UserObjects,
      });
    } catch (err) {
      throw new UnauthorizedException("해당 이메일은 존재하지 않습니다.");
    }
  }

  async isExistUserWithNickName(nickname: string): Promise<UserCoreEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { auth: { nickname } },
        relations: UserObjects,
      });
    } catch (err) {
      throw new UnauthorizedException("해당 닉네임은 존재하지 않습니다.");
    }
  }

  async createUser(
    registerUserDto: RegisterUserDto,
    hashed: string,
  ): Promise<void> {
    const password = hashed;
    const { realname, nickname, birth, gender, email, phonenumber } =
      registerUserDto;

    const userCommonColumn = { realname, birth, gender, phonenumber };
    const userAuthColumn = { nickname, email, password };
    const userActivityColumn = { point: 0, howMuchBuy: 0 };

    const promiseForSaveUserColumn = await Promise.allSettled([
      this.userCommonRepository.save({ ...userCommonColumn }),
      this.userAuthRepository.save({ ...userAuthColumn }),
      this.userActivityRepository.save({ ...userActivityColumn }),
    ]);

    const errorForSaveUserColumn = promiseForSaveUserColumn.filter(
      (idx: PromiseSettledResult<unknown>): idx is PromiseRejectedResult =>
        idx.status === "rejected",
    );

    if (errorForSaveUserColumn.length) {
      throw new InternalServerErrorException(
        errorForSaveUserColumn,
        "Save User Column Error",
      );
    }

    const successForSaveUserColumn = promiseForSaveUserColumn.filter(
      <T>(idx: PromiseSettledResult<T>): idx is PromiseFulfilledResult<T> =>
        idx.status === "fulfilled",
    );

    const [userCommonId, userAuthId, userActivityId] =
      successForSaveUserColumn.map((idx) => idx.value.id);

    const promiseForFindUserObject = await Promise.allSettled([
      this.userCommonRepository.findOne({ where: { id: userCommonId } }),
      this.userAuthRepository.findOne({ where: { id: userAuthId } }),
      this.userActivityRepository.findOne({ where: { id: userActivityId } }),
    ]);

    const errorForFindUserObject = promiseForFindUserObject.filter(
      (idx: PromiseSettledResult<unknown>): idx is PromiseRejectedResult =>
        idx.status === "rejected",
    );

    if (errorForFindUserObject.length) {
      throw new InternalServerErrorException(
        errorForFindUserObject,
        "Find User Object Error",
      );
    }

    const successForFindUserObject = promiseForFindUserObject.filter(
      <T>(idx: PromiseSettledResult<T>): idx is PromiseFulfilledResult<T> =>
        idx.status === "fulfilled",
    );

    const UserObject = [];
    for await (const idx of successForFindUserObject) {
      UserObject.push(idx.value);
    }

    // 사용 불가능
    // const [userCommonObject, userAuthObject, userActivityObject] =
    //   successForFindUserObject.map((idx) => idx.value);

    const userCommonObject: UserCommonEntity = UserObject[0];
    const userAuthObject: UserAuthEntity = UserObject[1];
    const userActivityObject: UserActivityEntity = UserObject[2];

    const createUserDto: CreateUserDto = {
      common: userCommonObject,
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
    const user = await this.isExistUserWithId(userId);

    const { common, auth } = user;

    common.realname = realname;
    common.birth = birth;
    common.gender = gender;
    common.phonenumber = phonenumber;
    auth.nickname = nickname;
    auth.password = hashed;

    await Promise.allSettled([
      this.userCommonRepository.save(common),
      this.userAuthRepository.save(auth),
    ]);
  }

  async deleteUser(userId: string): Promise<void> {
    // const userObject = await this.isExistUserWithId(userId);

    // const userCommonId
    await this.userRepository.delete(userId);
  }

  // async insertImageForUser(userId: string, imageId: string) {
  //   const user = await this.userCommonRepository.findOne({
  //     where: { id: userId },
  //     relations: ["activity"],
  //   });
  //   user.imageId = [imageId];
  //   await this.userCommonRepository.save(user);
  // }
}
