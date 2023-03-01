import { Injectable, Logger } from "@nestjs/common";
import { UserAuthEntity } from "src/model/user/entities/user.auth.entity";
import { ModifyUserDto } from "../dtos/modify-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { Repository } from "typeorm";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { CreateUserDto } from "../dtos/create-user.dto";
import { userSelectProperty } from "src/common/config/repository-select-configs/user-select";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { ClientUserEntity } from "../entities/client-user.entity";

@Injectable()
export class UserGeneralRepository {
  private readonly select = userSelectProperty;
  private readonly logger = new Logger("Repository");

  constructor(
    @InjectRepository(ClientUserEntity)
    private readonly clientUserGeneralRepository: Repository<ClientUserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileGeneralRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthGeneralRepository: Repository<UserAuthEntity>,
  ) {}

  async findClientUserWithId(id: string): Promise<ClientUserEntity> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserSelect)
        .from(ClientUserEntity, "client")
        .innerJoin("client.Profile", "Profile")
        .innerJoin("client.Auth", "Auth")
        .leftJoin("client.Product", "Product")
        .leftJoin("client.Review", "Review")
        .leftJoin("client.Inquiry", "Inquiry")
        .where("client.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUserWithEmail(email: string): Promise<ClientUserEntity> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserSelect)
        .from(ClientUserEntity, "client")
        .innerJoin("client.Profile", "Profile")
        .innerJoin("client.Auth", "Auth")
        .leftJoin("client.Product", "Product")
        .leftJoin("client.Review", "Review")
        .leftJoin("client.Inquiry", "Inquiry")
        .where("Auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUserWithNickName(
    nickname: string,
  ): Promise<ClientUserEntity> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserSelect)
        .from(ClientUserEntity, "client")
        .innerJoin("client.Profile", "Profile")
        .innerJoin("client.Auth", "Auth")
        .where("Auth.nickname = :nickname", { nickname })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUserWithRealName(
    realname: string,
  ): Promise<ClientUserEntity> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserSelect)
        .from(ClientUserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .where("Profile.realname = :realname", { realname })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUserWithPhoneNumber(
    phonenumber: string,
  ): Promise<ClientUserEntity> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserSelect)
        .from(ClientUserEntity, "client")
        .innerJoin("client.Profile", "Profile")
        .innerJoin("client.Auth", "Auth")
        .where("Profile.phonenumber = :phonenumber", { phonenumber })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserProfileInfoWithId(id: string): Promise<ClientUserEntity> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserProfileSelect)
        .from(ClientUserEntity, "client")
        .innerJoin("client.Profile", "Profile")
        .innerJoin("client.Auth", "Auth")
        .leftJoin("client.Product", "Product")
        .leftJoin("client.Review", "Review")
        .leftJoin("client.Inquiry", "Inquiry")
        .leftJoin("Product.Image", "ProductImage")
        .leftJoin("Review.Image", "ReviewImage")
        .leftJoin("Review.Video", "ReviewVideo")
        .leftJoin("Inquiry.Image", "InquiryImage")
        .leftJoin("Inquiry.Video", "InquiryVideo")
        .where("client.id = :id", { id })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findUserInfoFromAdmin(id: string): Promise<ClientUserEntity> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select(this.select.whenAdminSelectUser)
        .from(ClientUserEntity, "client")
        .innerJoin("client.Auth", "Auth")
        .leftJoin("client.Product", "Product")
        .leftJoin("client.Review", "Review")
        .leftJoin("client.Inquiry", "Inquiry")
        .leftJoin("Product.Image", "ProductImage")
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

  async createClientUser(
    registerUserDto: RegisterUserDto,
    hashed: string,
  ): Promise<void> {
    try {
      const password = hashed;
      const { realname, nickname, birth, gender, email, phonenumber } =
        registerUserDto;

      const userProfileColumn = { realname, birth, gender, phonenumber };
      const userAuthColumn = { nickname, email, password };

      const [userProfile, userAuth] = await Promise.all([
        this.userProfileGeneralRepository.save({ ...userProfileColumn }),
        this.userAuthGeneralRepository.save({ ...userAuthColumn }),
      ]);

      const [userProfileObject, userAuthObject] = await Promise.all([
        this.userProfileGeneralRepository
          .createQueryBuilder()
          .select("profile")
          .from(UserProfileEntity, "profile")
          .where("profile.id = :id", { id: userProfile.id })
          .getOne(),
        this.userAuthGeneralRepository
          .createQueryBuilder()
          .select("auth")
          .from(UserAuthEntity, "auth")
          .where("auth.id = :id", { id: userAuth.id })
          .getOne(),
      ]);

      const createUserDto: CreateUserDto = {
        Profile: userProfileObject,
        Auth: userAuthObject,
      };
      await this.clientUserGeneralRepository.save({ ...createUserDto });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async modifyClientUser(
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

  async modifyClientUserEmail(email: string, id: string): Promise<void> {
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

  async modifyClientUserNickName(nickname: string, id: string): Promise<void> {
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

  async modifyClientUserPhoneNumber(
    phonenumber: string,
    id: string,
  ): Promise<void> {
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

  async modifyClientUserPassword(password: string, id: string): Promise<void> {
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

  async deleteClientUser(id: string): Promise<void> {
    try {
      await this.clientUserGeneralRepository
        .createQueryBuilder()
        .delete()
        .from(ClientUserEntity)
        .where("id = :id", { id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUsersAllFromLastest(): Promise<ClientUserEntity[]> {
    try {
      return await this.userProfileGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserSimpleSelect)
        .from(ClientUserEntity, "user")
        .innerJoin("user.Auth", "Auth")
        .orderBy("user.createdAt", "DESC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findClientUsersAllFromOldest(): Promise<ClientUserEntity[]> {
    try {
      return await this.clientUserGeneralRepository
        .createQueryBuilder()
        .select(this.select.clientUserSimpleSelect)
        .from(ClientUserEntity, "user")
        .innerJoin("user.Auth", "Auth")
        .orderBy("user.createdAt", "ASC")
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
