import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  Delete,
} from "@nestjs/common";
import { verifyCookieKeys } from "src/common/config/cookie-key-configs";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { VerifyDataGuard } from "src/common/guards/verfiy/verify-data.guard";
import { JsonGeneralInterface } from "src/common/interceptors/general/interface/json-general-interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";

import { UserEntity } from "../entities/user.entity";
import { UserGeneralService } from "../services/user-general.service";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/user")
export class UserVersionOneOnlyAdminController {
  constructor(private readonly userGeneralService: UserGeneralService) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  async getUsersAllFromLastest(): Promise<JsonGeneralInterface<UserEntity[]>> {
    return {
      statusCode: 200,
      message: "전체 사용자 정보를 최신 순서로 가져옵니다.",
      result: await this.userGeneralService.getUsersAllFromLastest(),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/oldest")
  async getUsersAllFromOldest(): Promise<JsonGeneralInterface<UserEntity[]>> {
    return {
      statusCode: 200,
      message: "전체 사용자 정보를 오래된 순서로 가져옵니다.",
      result: await this.userGeneralService.getUsersAllFromOldest(),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/id/:id")
  async getUserById(
    @Param("id") userId: string,
  ): Promise<JsonGeneralInterface<UserEntity>> {
    return {
      statusCode: 200,
      message: `${userId}에 해당하는 사용자 정보를 가져옵니다.`,
      result: await this.userGeneralService.getUserById(userId),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(verifyCookieKeys.user.is_exist.userid_executed),
  )
  @Delete("/id/:id")
  async kickUser(
    @Param("id") userId: string,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userGeneralService.deleteUserWithId(userId);

    return {
      statusCode: 200,
      message: `${userId}에 해당하는 사용자를 추방합니다.`,
    };
  }
}
