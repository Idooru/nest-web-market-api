import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
  Delete,
} from "@nestjs/common";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { VerifyDataGuard } from "src/common/guards/verify/verify-data.guard";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { UserEntity } from "../../entities/user.entity";
import { UserGeneralService } from "../../services/user-general.service";
import { userVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/user-verify-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("v1 관리자 User API")
@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller("/api/v1/only-admin/user")
export class UserVersionOneOnlyAdminController {
  constructor(private readonly userGeneralService: UserGeneralService) {}

  @ApiOperation({
    summary: "find all users from latest",
    description:
      "전체 사용자 정보를 최신 순서로 가져옵니다. 사용자 배열의 길이가 0일 경우 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  async findAllUsersFromLatest(): Promise<JsonGeneralInterface<UserEntity[]>> {
    return {
      statusCode: 200,
      message: "전체 사용자 정보를 최신 순서로 가져옵니다.",
      result: await this.userGeneralService.findAllUsersFromLatest(),
    };
  }

  @ApiOperation({
    summary: "find all users from oldest",
    description:
      "전체 사용자 정보를 오래된 순서로 가져옵니다. 사용자 배열의 길이가 0일 경우 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/oldest")
  async findAllUsersFromOldest(): Promise<JsonGeneralInterface<UserEntity[]>> {
    return {
      statusCode: 200,
      message: "전체 사용자 정보를 오래된 순서로 가져옵니다.",
      result: await this.userGeneralService.findAllUsersFromOldest(),
    };
  }

  @ApiOperation({
    summary: "find client user info",
    description:
      "사용자의 아이디에 해당하는 사용자의 정보를 가져옵니다. 사용자의 아이디와 일치하는 row가 데이터베이스에 존재하지 않을 경우 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/:id")
  async findClientUserInfoFromAdminWithId(
    @Param("id") userId: string,
  ): Promise<JsonGeneralInterface<UserEntity>> {
    return {
      statusCode: 200,
      message: `${userId}에 해당하는 사용자 정보를 가져옵니다.`,
      result: await this.userGeneralService.findClientUserInfoFromAdminWithId(
        userId,
      ),
    };
  }

  @ApiOperation({
    summary: "kick user",
    description: "사용자의 아이디에 해당하는 사용자를 추방합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(userVerifyCookieKey.is_exist.id_executed))
  @Delete("/:id")
  async kickUser(
    @Param("id") userId: string,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userGeneralService.deleteUser(userId);

    return {
      statusCode: 200,
      message: `${userId}에 해당하는 사용자를 추방합니다.`,
    };
  }
}
