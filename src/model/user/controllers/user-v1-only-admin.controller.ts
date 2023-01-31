import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  Delete,
} from "@nestjs/common";
import { IsAdminGuard } from "src/common/guards/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/is-login.guard";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/json-general.interceptor";
import { UserEntity } from "../entities/user.entity";
import { UserService } from "../providers/user.service";

@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/user")
export class UserVersionOneOnlyAdminController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  async getUsersAllFromLastest(): Promise<JsonGeneralInterface<UserEntity[]>> {
    return {
      statusCode: 200,
      message: "전체 사용자 정보를 최신 순서로 가져옵니다.",
      result: await this.userService.getUsersAllFromLastest(),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/oldest")
  async getUsersAllFromOldest(): Promise<JsonGeneralInterface<UserEntity[]>> {
    return {
      statusCode: 200,
      message: "전체 사용자 정보를 오래된 순서로 가져옵니다.",
      result: await this.userService.getUsersAllFromOldest(),
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
      result: await this.userService.getUserById(userId),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/id/:id")
  async kickUser(
    @Param("id") userId: string,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userService.deleteUserWithId(userId);

    return {
      statusCode: 200,
      message: `${userId}에 해당하는 사용자를 추방합니다.`,
    };
  }
}
