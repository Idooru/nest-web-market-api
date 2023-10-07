import { ReviewModule } from "../review/review.module";
import { UserAuthEntity } from "./entities/user-auth.entity";
import { MediaModule } from "../media/media.module";
import { AuthModule } from "../auth/auth.module";
import { UserProfileEntity } from "./entities/user-profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { UserVersionOneFreeUseController } from "./controllers/v1/user-v1-free-use.controller";
import { UserVersionOneOnlyAdminController } from "./controllers/v1/user-v1-only-admin.controller";
import { ClientUserEntity } from "./entities/client-user.entity";
import { AdminUserEntity } from "./entities/admin-user.entity";
import { UserEntity } from "./entities/user.entity";
import { userSelectProperty } from "src/common/config/repository-select-configs/user.select";
import { UserTransaction } from "./logic/transaction/user.transaction";
import { UserRepositoryVO } from "./logic/transaction/user-repository.vo";
import { UserSearcher } from "./logic/user.searcher";
import { UserSecurity } from "./logic/user.security";
import { UserUpdateRepository } from "./repositories/user-update.repository";
import { UserSearchRepository } from "./repositories/user-search.repository";
import { UserUpdateService } from "./services/user-update.service";
import { UserQueryRunnerProvider } from "./logic/transaction/user-query-runner.provider";
import { UserValidateRepository } from "./repositories/user-validate.repository";
import { UserValidator } from "./logic/user.validator";
import { UserFactoryService } from "./services/user-factory.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserProfileEntity,
      UserAuthEntity,
      ClientUserEntity,
      AdminUserEntity,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => MediaModule),
    forwardRef(() => ReviewModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [
    UserVersionOneFreeUseController,
    UserVersionOneOnlyAdminController,
  ],
  providers: [
    {
      provide: "UserSelectProperty",
      useValue: userSelectProperty,
    },
    UserSearcher,
    UserValidator,
    UserSecurity,
    UserTransaction,
    UserQueryRunnerProvider,
    UserRepositoryVO,
    UserUpdateService,
    UserFactoryService,
    UserSearchRepository,
    UserUpdateRepository,
    UserValidateRepository,
  ],
  exports: [UserSearcher, UserValidator],
})
export class UserModule {}
