import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountEntity } from "./entities/account.entity";
import { AccountV1Controller } from "./controllers/v1/account-v1.controller";
import { AccountUpdateService } from "./services/account-update.service";
import { AccountUpdateRepository } from "./repositories/account-update.repository";
import { LibraryModule } from "../../common/lib/library.module";
import { UserModule } from "../user/user.module";
import { AccountSearcher } from "./logic/account.searcher";
import { AccountSearchRepository } from "./repositories/account-search.repository";
import { AccountValidateRepository } from "./repositories/account-validate.repository";
import { AccountValidator } from "./logic/account.validator";

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
    UserModule,
    LibraryModule,
  ],
  controllers: [AccountV1Controller],
  providers: [
    AccountSearcher,
    AccountValidator,
    AccountUpdateService,
    AccountUpdateRepository,
    AccountSearchRepository,
    AccountValidateRepository,
  ],
})
export class AccountModule {}
