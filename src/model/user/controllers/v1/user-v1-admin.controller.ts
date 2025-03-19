import { Controller, UseGuards, UseInterceptors, Get, Param, Delete } from "@nestjs/common";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { UserEntity } from "../../entities/user.entity";
import { ApiTags } from "@nestjs/swagger";
import { UserSearcher } from "../../logic/user.searcher";
import { UserService } from "../../services/user.service";
import { UserIdValidatePipe } from "../../pipe/exist/user-id-validate.pipe";
import { FindAllUsersFromLatestSwagger } from "../../docs/user-v1-admin-controller/find-all-users-from-latest.swagger";
import { FindAllUsersFromOldestSwagger } from "../../docs/user-v1-admin-controller/find-all-users-from-oldest.swagger";
import { FindClientUserInfoSwagger } from "../../docs/user-v1-admin-controller/find-client-user-info.swagger";
import { KickUserSwagger } from "../../docs/user-v1-admin-controller/kick-user.swagger";

@ApiTags("v1 관리자 User API")
@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/admin/user", version: "1" })
export class UserV1AdminController {
  constructor(private readonly userSearcher: UserSearcher, private readonly userService: UserService) {}

  @FindAllUsersFromLatestSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/")
  public async findAllUsersFromLatest(): Promise<JsonGeneralInterface<UserEntity[]>> {
    const result = await this.userSearcher.findAllUsersFromLatest();

    return {
      statusCode: 200,
      message: "전체 사용자 정보를 최신 순서로 가져옵니다.",
      result,
    };
  }

  @FindAllUsersFromOldestSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/oldest")
  public async findAllUsersFromOldest(): Promise<JsonGeneralInterface<UserEntity[]>> {
    const result = await this.userSearcher.findAllUsersFromOldest();

    return {
      statusCode: 200,
      message: "전체 사용자 정보를 오래된 순서로 가져옵니다.",
      result,
    };
  }

  @FindClientUserInfoSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/:userId")
  public async findClientUserInfo(
    @Param("userId", UserIdValidatePipe) userId: string,
  ): Promise<JsonGeneralInterface<UserEntity>> {
    const result = await this.userSearcher.findClientUserInfo(userId);

    return {
      statusCode: 200,
      message: `${userId}에 해당하는 고객 사용자의 상세 정보를 가져옵니다.`,
      result,
    };
  }

  @KickUserSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @Delete("/:userId")
  public async kickUser(@Param("userId", UserIdValidatePipe) userId: string): Promise<JsonGeneralInterface<void>> {
    await this.userService.deleteUser(userId);

    return {
      statusCode: 200,
      message: `${userId}에 해당하는 사용자를 추방합니다.`,
    };
  }
}
