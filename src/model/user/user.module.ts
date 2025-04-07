import { ReviewModule } from "../review/review.module";
import { UserAuthEntity } from "./entities/user-auth.entity";
import { MediaModule } from "../media/media.module";
import { AuthModule } from "../auth/auth.module";
import { UserProfileEntity } from "./entities/user-profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { UserV1Controller } from "./controllers/v1/user-v1.controller";
import { UserV1AdminController } from "./controllers/v1/user-v1-admin.controller";
import { ClientUserEntity } from "./entities/client-user.entity";
import { AdminUserEntity } from "./entities/admin-user.entity";
import { UserEntity } from "./entities/user.entity";
import { userSelect } from "src/common/config/repository-select-configs/user.select";
import { UserTransactionExecutor } from "./logic/transaction/user-transaction.executor";
import { UserSearcher } from "./logic/user.searcher";
import { UserSecurity } from "./logic/user.security";
import { UserUpdateRepository } from "./repositories/user-update.repository";
import { UserSearchRepository } from "./repositories/user-search.repository";
import { UserService } from "./services/user.service";
import { UserTransactionInitializer } from "./logic/transaction/user-transaction.initializer";
import { UserValidateRepository } from "./repositories/user-validate.repository";
import { UserValidator } from "./logic/user.validator";
import { UserEventMapSetter } from "./logic/user-event-map.setter";
import { mailEventMap } from "../../common/config/event-configs";
import { Transactional } from "../../common/interfaces/initializer/transactional";
import { UserTransactionContext } from "./logic/transaction/user-transaction.context";

const userIdFilter = { provide: "user-id-filter", useValue: "user.id = :id" };

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserProfileEntity, UserAuthEntity, ClientUserEntity, AdminUserEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => MediaModule),
    forwardRef(() => ReviewModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [UserV1Controller, UserV1AdminController],
  providers: [
    { provide: "user-select", useValue: userSelect },
    { provide: "mail-event-map", useValue: mailEventMap },
    { provide: Transactional, useClass: UserTransactionInitializer },
    userIdFilter,
    UserSearcher,
    UserValidator,
    UserSecurity,
    UserTransactionInitializer,
    UserTransactionExecutor,
    UserTransactionContext,
    UserEventMapSetter,
    UserService,
    UserSearchRepository,
    UserUpdateRepository,
    UserValidateRepository,
  ],
  exports: [userIdFilter, UserSearcher, UserValidator, UserService],
})
export class UserModule {}
