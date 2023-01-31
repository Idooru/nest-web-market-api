import { Controller, UseGuards, UseInterceptors, Get } from "@nestjs/common";
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
}
