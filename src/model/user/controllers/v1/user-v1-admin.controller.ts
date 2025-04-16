import { Controller, UseGuards, UseInterceptors, Get, Param, Delete, Query } from "@nestjs/common";
import { IsAdminGuard } from "src/common/guards/authenticate/is-admin.guard";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { ApiTags } from "@nestjs/swagger";
import { UserSearcher } from "../../logic/user.searcher";
import { UserService } from "../../services/user.service";
import { UserIdValidatePipe } from "../../pipe/exist/user-id-validate.pipe";
import { FindDetailClientUserSwagger } from "../../docs/user-v1-admin-controller/find-detail-client-user.swagger";
import { KickUserSwagger } from "../../docs/user-v1-admin-controller/kick-user.swagger";
import { ClientUserRawDto } from "../../dto/response/client-user-raw.dto";
import { ClientUserIdValidatePipe } from "../../pipe/exist/client-user-id-validate.pipe";
import { UserBasicRawDto } from "../../dto/response/user-basic-raw.dto";
import { FindAllUsersDto } from "../../dto/request/find-all-users.dto";
import { FindAllUsersSwagger } from "../../docs/user-v1-admin-controller/find-all-users.swagger";

@ApiTags("v1 관리자 User API")
@UseGuards(IsAdminGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/admin/user", version: "1" })
export class UserV1AdminController {
  constructor(private readonly userSearcher: UserSearcher, private readonly userService: UserService) {}

  // @FindAllUsersSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/all")
  public async findAllUsers(@Query() query: FindAllUsersDto): Promise<JsonGeneralInterface<UserBasicRawDto[]>> {
    const result = await this.userSearcher.findAllRaws(query);

    return {
      statusCode: 200,
      message: "query 조건에 해당하는 전체 사용자 정보를 가져옵니다.",
      result,
    };
  }

  // @FindDetailClientUserSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/:userId")
  public async findDetailClientUser(
    @Param("userId", ClientUserIdValidatePipe) userId: string,
  ): Promise<JsonGeneralInterface<ClientUserRawDto>> {
    const result = await this.userSearcher.findClientUserRaw(userId);

    return {
      statusCode: 200,
      message: `${userId}에 해당하는 고객 사용자의 상세 정보를 가져옵니다.`,
      result,
    };
  }

  // @KickUserSwagger()
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
