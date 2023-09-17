import { DataSource, QueryRunner } from "typeorm";
import { UserRepositoryPayload, UserRepositoryVO } from "../user-repository.vo";
import { UserEntity } from "../../entities/user.entity";
import { AdminUserEntity } from "../../entities/admin-user.entity";
import { ClientUserEntity } from "../../entities/client-user.entity";
import { UserProfileEntity } from "../../entities/user-profile.entity";
import { UserAuthEntity } from "../../entities/user-auth.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepositoryVO: UserRepositoryVO,
  ) {}

  async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const repositoryPayload: UserRepositoryPayload = {
      userRepository: queryRunner.manager.getRepository(UserEntity),
      adminUserRepository: queryRunner.manager.getRepository(AdminUserEntity),
      clientUserRepository: queryRunner.manager.getRepository(ClientUserEntity),
      userProfileRepository:
        queryRunner.manager.getRepository(UserProfileEntity),
      userAuthRepository: queryRunner.manager.getRepository(UserAuthEntity),
    };

    this.userRepositoryVO.setRepositoryPayload(repositoryPayload);

    return queryRunner;
  }
}
