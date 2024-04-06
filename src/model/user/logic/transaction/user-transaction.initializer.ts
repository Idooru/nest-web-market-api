import { DataSource, QueryRunner } from "typeorm";
import { UserRepositoryPayload } from "./user-repository.payload";
import { UserEntity } from "../../entities/user.entity";
import { AdminUserEntity } from "../../entities/admin-user.entity";
import { ClientUserEntity } from "../../entities/client-user.entity";
import { UserProfileEntity } from "../../entities/user-profile.entity";
import { UserAuthEntity } from "../../entities/user-auth.entity";
import { Injectable } from "@nestjs/common";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class UserTransactionInitializer extends Transactional<UserRepositoryPayload> {
  private payload: UserRepositoryPayload;

  constructor(private readonly dataSource: DataSource) {
    super();
  }

  @Implemented
  public async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.payload = {
      user: queryRunner.manager.getRepository(UserEntity),
      adminUser: queryRunner.manager.getRepository(AdminUserEntity),
      clientUser: queryRunner.manager.getRepository(ClientUserEntity),
      userProfile: queryRunner.manager.getRepository(UserProfileEntity),
      userAuth: queryRunner.manager.getRepository(UserAuthEntity),
    };

    return queryRunner;
  }

  @Implemented
  public getRepository(): UserRepositoryPayload {
    return this.payload;
  }
}
