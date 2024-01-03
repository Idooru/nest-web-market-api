import { ReviewModule } from "../review/review.module";
import { UserAuthEntity } from "./entities/user-auth.entity";
import { MediaModule } from "../media/media.module";
import { AuthModule } from "../auth/auth.module";
import { UserProfileEntity } from "./entities/user-profile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { UserV1Controller } from "./controllers/v1/user-v1.controller";
import { UserV1AdminController } from "./controllers/v1/user-v1-admin.controller";
import { ClientUserEntity } from "./entities/client-user.entity";
import { AdminUserEntity } from "./entities/admin-user.entity";
import { UserEntity } from "./entities/user.entity";
import { userSelectProperty } from "src/common/config/repository-select-configs/user.select";
import { UserTransaction } from "./logic/transaction/user.transaction";
import { UserSearcher } from "./logic/user.searcher";
import { UserSecurity } from "./logic/user.security";
import { UserUpdateRepository } from "./repositories/user-update.repository";
import { UserSearchRepository } from "./repositories/user-search.repository";
import { UserUpdateService } from "./services/user-update.service";
import { UserQueryRunnerProvider } from "./logic/transaction/user-query-runner.provider";
import { UserValidateRepository } from "./repositories/user-validate.repository";
import { UserValidator } from "./logic/user.validator";
import { UserRegisterEventMiddleware } from "./middleware/user-register-event.middleware";
import { UserEventMapSetter } from "./logic/user-event-map.setter";
import { mailEventMap } from "../../common/config/event-configs";
import { Transactional } from "../../common/interfaces/initializer/transactional";

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
  controllers: [UserV1Controller, UserV1AdminController],
  providers: [
    { provide: "UserSelectProperty", useValue: userSelectProperty },
    { provide: "MailEventMap", useValue: mailEventMap },
    { provide: Transactional, useClass: UserQueryRunnerProvider },
    UserSearcher,
    UserValidator,
    UserSecurity,
    UserTransaction,
    UserEventMapSetter,
    UserRegisterEventMiddleware,
    UserQueryRunnerProvider,
    UserUpdateService,
    UserSearchRepository,
    UserUpdateRepository,
    UserValidateRepository,
  ],
  exports: [UserSearcher, UserValidator, UserUpdateService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(UserRegisterEventMiddleware)
      .forRoutes("/api/v1/user/register");
  }
}
