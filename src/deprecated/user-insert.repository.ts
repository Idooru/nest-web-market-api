// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { AdminUserEntity } from "../model/user/entities/admin-user.entity";
// import { ClientUserEntity } from "../model/user/entities/client-user.entity";
// import { UserAuthEntity } from "../model/user/entities/user-auth.entity";
// import { UserEntity } from "../model/user/entities/user.entity";
// import { UserProfileEntity } from "../model/user/entities/user-profile.entity";
// import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
// import { TypeOrmErrorHandlingBuilder } from "src/common/lib/error-handler/typeorm-error-handling.builder";
// import { UserErrorHandler } from "../model/user/error/user-error.handler";
// import { ClientUserErrorHandler } from "../model/user/error/client-user-error.handler";
// import { AdminUserErrorHandler } from "../model/user/error/admin-user-error.handler";

// @Injectable()
// export class UserInsertRepository
//   extends ErrorHandlerProps
//   implements IUserInsertRepository
// {
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepository: Repository<UserEntity>,
//     @InjectRepository(UserProfileEntity)
//     private readonly userProfileRepository: Repository<UserProfileEntity>,
//     @InjectRepository(UserAuthEntity)
//     private readonly userAuthRepository: Repository<UserAuthEntity>,
//     @InjectRepository(ClientUserEntity)
//     private readonly clientUserRepository: Repository<ClientUserEntity>,
//     @InjectRepository(AdminUserEntity)
//     private readonly adminUserRepository: Repository<AdminUserEntity>,
//     private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlingBuilder,
//   ) {
//     super();
//   }

//   async findOneUserBaseById(id: string): Promise<UserEntity> {
//     try {
//       return await this.userRepository
//         .createQueryBuilder()
//         .select("userBase")
//         .from(UserEntity, "userBase")
//         .where("userBase.id = :id", { id })
//         .getOneOrFail();
//     } catch (err) {
//       this.methodName = this.findOneUserBaseById.name;
//       this.typeOrmErrorHandlerBuilder
//         .setErrorHandler(UserErrorHandler)
//         .setError(err)
//         .setSourceNames(this.className, this.methodName)
//         .handle();
//     }
//   }

//   async findOneClientUserById(id: string): Promise<ClientUserEntity> {
//     try {
//       return await this.clientUserRepository
//         .createQueryBuilder()
//         .select("clientUser")
//         .from(ClientUserEntity, "clientUser")
//         .where("clientUser.id = :id", { id })
//         .getOneOrFail();
//     } catch (err) {
//       this.methodName = this.findOneClientUserById.name;
//       this.typeOrmErrorHandlerBuilder
//         .setErrorHandler(ClientUserErrorHandler)
//         .setError(err)
//         .setSourceNames(this.className, this.methodName)
//         .handle();
//     }
//   }

//   async findOneAdminUserById(id: string): Promise<AdminUserEntity> {
//     try {
//       return await this.adminUserRepository
//         .createQueryBuilder()
//         .select("adminUser")
//         .from(AdminUserEntity, "adminUser")
//         .where("adminUser.id = :id", { id })
//         .getOneOrFail();
//     } catch (err) {
//       this.methodName = this.findOneAdminUserById.name;
//       this.typeOrmErrorHandlerBuilder
//         .setErrorHandler(AdminUserErrorHandler)
//         .setError(err)
//         .setSourceNames(this.className, this.methodName)
//         .handle();
//     }
//   }

//   async insertUserBaseIdOnUserProfile(
//     userBase: UserEntity,
//     userProfile: UserProfileEntity,
//   ): Promise<void> {
//     try {
//       await this.userProfileRepository
//         .createQueryBuilder()
//         .update(UserProfileEntity)
//         .set({ User: userBase })
//         .where("id = :id", { id: userProfile.id })
//         .execute();
//     } catch (err) {
//       this.methodName = this.insertUserBaseIdOnUserProfile.name;
//       this.typeOrmErrorHandlerBuilder
//         .setErrorHandler(UserErrorHandler)
//         .setError(err)
//         .setSourceNames(this.className, this.methodName)
//         .handle();
//     }
//   }

//   async insertUserBaseIdOnUserAuth(
//     userBase: UserEntity,
//     userAuth: UserAuthEntity,
//   ): Promise<void> {
//     try {
//       await this.userAuthRepository
//         .createQueryBuilder()
//         .update(UserAuthEntity)
//         .set({ User: userBase })
//         .where("id = :id", { id: userAuth.id })
//         .execute();
//     } catch (err) {
//       this.methodName = this.insertUserBaseIdOnUserAuth.name;
//       this.typeOrmErrorHandlerBuilder
//         .setErrorHandler(UserErrorHandler)
//         .setError(err)
//         .setSourceNames(this.className, this.methodName)
//         .handle();
//     }
//   }

//   async insertUserBaseIdOnClientUser(
//     userBase: UserEntity,
//     clientUser: ClientUserEntity,
//   ): Promise<void> {
//     try {
//       await this.clientUserRepository
//         .createQueryBuilder()
//         .update(ClientUserEntity)
//         .set({ User: userBase })
//         .where("id = :id", { id: clientUser.id })
//         .execute();
//     } catch (err) {
//       this.methodName = this.insertUserBaseIdOnClientUser.name;
//       this.typeOrmErrorHandlerBuilder
//         .setErrorHandler(ClientUserErrorHandler)
//         .setError(err)
//         .setSourceNames(this.className, this.methodName)
//         .handle();
//     }
//   }

//   async insertUserBaseIdOnAdminUser(
//     userBase: UserEntity,
//     adminUser: AdminUserEntity,
//   ): Promise<void> {
//     try {
//       await this.adminUserRepository
//         .createQueryBuilder()
//         .update(AdminUserEntity)
//         .set({ User: userBase })
//         .where("id = :id", { id: adminUser.id })
//         .execute();
//     } catch (err) {
//       this.methodName = this.insertUserBaseIdOnAdminUser.name;
//       this.typeOrmErrorHandlerBuilder
//         .setErrorHandler(AdminUserErrorHandler)
//         .setError(err)
//         .setSourceNames(this.className, this.methodName)
//         .handle();
//     }
//   }
// }
