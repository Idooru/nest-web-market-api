import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { UserSelectProperty } from "src/common/config/repository-select-configs/user.select";
import { ClientUserEntity } from "../entities/client-user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { UserProfileEntity } from "../entities/user-profile.entity";

@Injectable()
export class UserSearchRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ClientUserEntity)
    private readonly clientUserRepository: Repository<ClientUserEntity>,
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @Inject("UserSelectProperty")
    private readonly userSelect: UserSelectProperty,
  ) {}

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    const users = await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.clientUserSimple)
      .from(UserEntity, "user")
      .innerJoin("user.Auth", "Auth")
      .orderBy("user.createdAt", "DESC")
      .getMany();

    if (!users.length) {
      throw new NotFoundException("사용자가 없습니다.");
    }

    return users;
  }

  async findAllUsersFromOldest(): Promise<UserEntity[]> {
    const users = await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.clientUserSimple)
      .from(UserEntity, "user")
      .innerJoin("user.Auth", "Auth")
      .orderBy("user.createdAt", "ASC")
      .getMany();

    if (!users.length) {
      throw new NotFoundException("사용자가 없습니다.");
    }

    return users;
  }

  async findUserWithId(id: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("user.id = :id", { id })
      .getOne();
  }

  async findClientUserWithId(id: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.clientUser)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.clientActions", "Client")
      .where("user.id = :id", { id })
      .getOne();
  }

  async findAdminUserWithId(id: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.adminUser)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.adminActions", "Admin")
      .where("user.id = :id", { id })
      .getOne();
  }

  async findClientUserObjectWithId(id: string): Promise<ClientUserEntity> {
    const user = await this.findClientUserWithId(id);

    return await this.clientUserRepository
      .createQueryBuilder()
      .select(["client", "User", "Auth"])
      .from(ClientUserEntity, "client")
      .innerJoin("client.User", "User")
      .innerJoin("User.Auth", "Auth")
      .where("client.id = :id", { id: user.clientActions.id })
      .getOne();
  }

  async findAdminUserObjectWithId(id: string): Promise<AdminUserEntity> {
    const user = await this.findAdminUserWithId(id);

    return await this.adminUserRepository
      .createQueryBuilder()
      .select(["admin"])
      .from(AdminUserEntity, "admin")
      .where("admin.id = :id", { id: user.adminActions.id })
      .getOne();
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("Auth.email = :email", { email })
      .getOne();
  }

  async findUserWithNickname(nickname: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("Auth.nickname = :nickname", { nickname })
      .getOne();
  }

  async findUserForgotten(
    realname: string,
    phonenumber: string,
  ): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.userBase)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .where("Profile.realname = :realname", { realname })
      .andWhere("Profile.phonenumber = :phonenumber", { phonenumber })
      .getOne();
  }

  async findClientUserProfileInfoWithId(id: string): Promise<UserEntity> {
    const client = await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.clientUserProfile)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.clientActions", "Client")
      .leftJoin("Client.Cart", "Cart")
      .leftJoin("Cart.Product", "Product")
      .leftJoin("Product.Image", "ProductImage")
      .leftJoin("Client.Payment", "Payment")
      .leftJoin("Client.writtenReview", "Review")
      .leftJoin("Review.Image", "ReviewImage")
      .leftJoin("Review.Video", "ReviewVideo")
      .leftJoin("Client.writtenInquiryRequest", "InquiryRequest")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
      .leftJoin("InquiryRequest.InquiryResponse", "InquiryResponse")
      .leftJoin("InquiryResponse.Image", "InquiryResponseImage")
      .leftJoin("InquiryResponse.Video", "InquiryResponseVideo")
      .where("user.id = :id", { id })
      .getOne();

    client.clientActions.id = undefined;
    return client;
  }

  async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    const admin = await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.adminUserProfile)
      .from(UserEntity, "user")
      .innerJoin("user.Profile", "Profile")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.adminActions", "Admin")
      .leftJoin("Admin.createdProduct", "Product")
      .leftJoin("Product.Image", "ProductImage")
      .leftJoin("Product.StarRate", "StarRate")
      .leftJoin("Product.Review", "Review")
      .leftJoin("Product.InquiryRequest", "InquiryRequest")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
      .leftJoin("Review.Image", "ReviewImage")
      .leftJoin("Review.Video", "ReviewVideo")
      .leftJoin("Admin.writtenInquiryResponse", "InquiryResponse")
      .leftJoin("InquiryResponse.Image", "InquiryResponseImage")
      .leftJoin("InquiryResponse.Video", "InquiryResponseVideo")
      .leftJoin("InquiryResponse.InquiryRequest", "ReceivedInquiryRequest")
      .leftJoin("ReceivedInquiryRequest.Image", "ReceivedInquiryRequestImage")
      .leftJoin("ReceivedInquiryRequest.Video", "ReceivedInquiryRequestVideo")
      .where("user.id = :id", { id })
      .getOne();

    admin.adminActions.id = undefined;
    return admin;
  }

  async findClientUserInfo(id: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder()
      .select(this.userSelect.whenAdminClientUser)
      .from(UserEntity, "user")
      .innerJoin("user.Auth", "Auth")
      .innerJoin("user.clientActions", "Client")
      .leftJoin("Client.purchasedProduct", "Product")
      .leftJoin("Product.Image", "ProductImage")
      .leftJoin("Client.writtenReview", "Review")
      .leftJoin("Review.Image", "ReviewImage")
      .leftJoin("Review.Video", "ReviewVideo")
      .leftJoin("Client.writtenInquiryRequest", "InquiryRequest")
      .leftJoin("InquiryRequest.Image", "InquiryRequestImage")
      .leftJoin("InquiryRequest.Video", "InquiryRequestVideo")
      .where("user.id = :id", { id })
      .getOne();
  }

  async findRefreshTokenWithId(id: string): Promise<UserAuthEntity> {
    return await this.userAuthRepository
      .createQueryBuilder()
      .select("auth.refreshToken")
      .from(UserAuthEntity, "auth")
      .where("auth.id = :id", { id })
      .getOne();
  }
}
