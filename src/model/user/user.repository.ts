import { UserActivityEntity } from "./entities/user.activity.entity";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { PatchUserDto } from "./dtos/patch-user.dto";
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserCommonEntity } from "./entities/user.common.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { UserCoreEntity } from "./entities/user.core.entity";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserCoreEntity)
    private readonly userCoreRepository: Repository<UserCoreEntity>,
    @InjectRepository(UserCommonEntity)
    private readonly userCommonRepository: Repository<UserCommonEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserActivityEntity)
    private readonly userActivityRepository: Repository<UserActivityEntity>,
  ) {}

  async checkUserEmail(email: string) {
    const found = await this.userAuthRepository.findOne({ where: { email } });

    if (found) {
      throw new UnauthorizedException("해당 이메일은 사용중입니다.");
    }
  }

  async checkUserNickName(nickName: string) {
    const found = await this.userAuthRepository.findOne({
      where: { nickName },
    });

    if (found) {
      throw new UnauthorizedException("해당 닉네임은 사용중입니다.");
    }
  }

  async checkUserPhoneNumber(phoneNumber: string): Promise<void> {
    const userPhoneNumber = await this.userCommonRepository.findOne({
      where: { phoneNumber },
    });

    if (userPhoneNumber) {
      throw new UnauthorizedException("해당 전화번호는 사용중입니다.");
    }
  }

  async isExistUserWithId(id: string): Promise<UserCoreEntity> {
    try {
      return await this.userCoreRepository.findOneOrFail({ where: { id } });
    } catch (err) {
      throw new UnauthorizedException("해당 사용자아이디는 존재하지 않습니다.");
    }
  }

  async isExistUserWithEmail(email: string): Promise<UserCommonEntity> {
    try {
      return await this.userCommonRepository.findOneOrFail({
        where: { email },
      });
    } catch (err) {
      throw new UnauthorizedException("해당 이메일은 존재하지 않습니다.");
    }
  }

  async isExistUserWithNickName(nickName: string): Promise<UserAuthEntity> {
    try {
      return await this.userAuthRepository.findOneOrFail({
        where: { nickName },
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
    const { realName, nickName, birth, gender, email, phoneNumber } =
      registerUserDto;

    const userCommonColumn = { realName, birth, gender, phoneNumber };
    const userAuthColumn = { nickName, email, password };
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

    const userCommonObject = await this.userCommonRepository.findOne({
      where: { id: userCommonId },
    });

    const userAuthObject = await this.userAuthRepository.findOne({
      where: { id: userAuthId },
    });

    const userActivityObject = await this.userActivityRepository.findOne({
      where: { id: userActivityId },
    });

    const createUserDto: CreateUserDto = {
      commonId: userCommonObject,
      authId: userAuthObject,
      activityId: userActivityObject,
    };

    await this.userCoreRepository.save({ ...createUserDto });
    // const promiseForFindUserObject = await Promise.allSettled([
    //   this.userCommonRepository.findOne({ where: { id: userCommonId } }),
    //   this.userAuthRepository.findOne({ where: { id: userAuthId } }),
    //   this.userActivityRepository.findOne({
    //     where: { id: userActivityId },
    //   }),
    // ]);

    // const errorForFindUserObject = promiseForFindUserObject.filter(
    //   (idx: PromiseSettledResult<unknown>): idx is PromiseRejectedResult =>
    //     idx.status === "rejected",
    // );

    // if (errorForFindUserObject.length) {
    //   throw new InternalServerErrorException(
    //     errorForFindUserObject,
    //     "Find User Object Error",
    //   );
    // }

    // const successForFindUserObject = promiseForFindUserObject.filter(
    //   <T>(idx: PromiseSettledResult<T>): idx is PromiseFulfilledResult<T> =>
    //     idx.status === "fulfilled",
    // );

    // const [commonId, authId, activityId] = successForFindUserObject.map(
    //   (idx) => idx.value,
    // );

    // const createUserDto = {
    //   common: commonId,
    //   auth: authId,
    //   activity: activityId,
    // };

    // await this.userCoreRepository.save({ ...createUserDto });
  }

  async patchUser(
    patchUserDto: PatchUserDto,
    hashed: string,
    userId: string,
  ): Promise<void> {
    const password = { password: hashed };
    const payload = { ...patchUserDto, ...password };
    await this.userCommonRepository.update(userId, payload);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userCommonRepository.delete(userId);
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
