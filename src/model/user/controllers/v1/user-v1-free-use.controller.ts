import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { JwtAccessTokenPayload } from "../../../auth/jwt/jwt-access-token-payload.interface";
import { IsLoginGuard } from "../../../../common/guards/authenticate/is-login.guard";
import { LoginUserDto } from "../../dtos/login-user.dto";
import { ModifyUserDto } from "../../dtos/modify-user.dto";
import { ResetPasswordDto } from "../../dtos/reset-password.dto";
import { GetJWT } from "../../../../common/decorators/get.jwt.decorator";
import { IsNotLoginGuard } from "../../../../common/guards/authenticate/is-not-login.guard";
import { IsRefreshTokenAvailableGuard } from "src/common/guards/authenticate/is-refresh-token-available.guard";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonJwtAuthInterface } from "src/common/interceptors/interface/json-jwt-auth.interface";
import { JsonJwtAuthInterceptor } from "src/common/interceptors/general/json-jwt-auth.interceptor";
import { JsonJwtLogoutInterceptor } from "src/common/interceptors/general/json-jwt-logout.interceptor";
import { JsonJwtLogoutInterface } from "src/common/interceptors/interface/json-jwt-logout.interface";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { UserEntity } from "../../entities/user.entity";
import { ModifyUserEmailDto } from "../../dtos/modify-user-email.dto";
import { ModifyUserNicknameDto } from "../../dtos/modify-user-nickname.dto";
import { ModifyUserPhonenumberDto } from "../../dtos/modify-user-phonenumber.dto";
import { ModifyUserPasswordDto } from "../../dtos/modify-user-password.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserTransaction } from "../../logic/user.transaction";
import { UserSecurity } from "../../logic/user.security";
import { UserSearcher } from "../../logic/user.searcher";
import { UserOperationService } from "../../services/user-operation.service";

@ApiTags("v1 공용 User API")
@Controller("/api/v1/free-use/user")
export class UserVersionOneFreeUseController {
  constructor(
    private readonly userTransaction: UserTransaction,
    private readonly userSearcher: UserSearcher,
    private readonly userSecurity: UserSecurity,
    private readonly userOperationService: UserOperationService,
  ) {}

  @ApiOperation({
    summary: "register",
    description:
      "회원 가입을 합니다. 회원가입을 할 때 사용된 이메일, 닉네임, 전화번호등이 이미 데이터베이스에 존재하면 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/register")
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userTransaction.register(registerUserDto);

    return {
      statusCode: 201,
      message: "사용자 회원가입을 완료하였습니다.",
    };
  }

  @ApiOperation({
    summary: "get my profile",
    description:
      "본인의 프로필 정보를 가져옵니다. 본인 계정의 권한에 해당되는 정보를 가져옵니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Get("/profile")
  async whoAmI(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<UserEntity>> {
    const [message, result] = await this.userSearcher.findUserProfile(
      jwtPayload,
    );

    return {
      statusCode: 200,
      message,
      result,
    };
  }

  @ApiOperation({
    summary: "login",
    description:
      "로그인을 합니다. 계정에 해당하는 이메일과 비밀번호가 일치하지 않다면 에러를 반환합니다. 로그인이 성공하면 access token과 refresh token이 담겨진 쿠키를 얻습니다.",
  })
  @UseInterceptors(JsonJwtAuthInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/login")
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<JsonJwtAuthInterface> {
    const { accessToken, refreshToken } = await this.userSecurity.login(
      loginUserDto,
    );

    return {
      statusCode: 201,
      message: "로그인을 완료하였습니다. 쿠키를 확인하세요.",
      cookieKey: ["access_token", "refresh_token"],
      cookieValue: [accessToken, refreshToken],
    };
  }

  @ApiOperation({
    summary: "refresh token",
    description:
      "토큰을 재발급 받습니다. access token의 유효기간이 끝났다고 클라이언트에서 판단하면 이 api를 호출 할 수 있도록 합니다. 만약 refresh token의 유효기간이 끝났을 때 이 api를 호출 하면 access token, refresh token이 담긴 쿠키를 제거하여 로그아웃 됩니다.",
  })
  @UseInterceptors(JsonJwtAuthInterceptor)
  @UseGuards(IsRefreshTokenAvailableGuard)
  @Get("/refresh-token")
  async refreshToken(
    @GetJWT() jwtPayload: JwtRefreshTokenPayload,
  ): Promise<JsonJwtAuthInterface> {
    const { accessToken, refreshToken } = await this.userSecurity.refreshToken(
      jwtPayload,
    );

    return {
      statusCode: 200,
      message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
      cookieKey: ["access_token", "refresh_token"],
      cookieValue: [accessToken, refreshToken],
    };
  }

  @ApiOperation({
    summary: "logout",
    description:
      "로그아웃을 합니다. access token, refresh token이 담긴 쿠키를 제거합니다.",
  })
  @UseInterceptors(JsonJwtLogoutInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/logout")
  logout(): JsonJwtLogoutInterface {
    return {
      statusCode: 200,
      message: "로그아웃을 완료하였습니다.",
      cookieKey: ["access_token", "refresh_token"],
    };
  }

  @ApiOperation({
    summary: "modify user",
    description:
      "로그인을 했을 때 본인의 사용자 전체 column을 수정합니다. 수정하려는 이메일, 닉네임, 전화번호가 이미 데이터베이스에 존재 한다면 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Put("/me")
  async modifyUser(
    @Body() modifyUserDto: ModifyUserDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userTransaction.modifyUser(modifyUserDto, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "사용자 정보를 수정합니다.",
    };
  }

  @ApiOperation({
    summary: "modify user email",
    description:
      "로그인을 했을 때 본인의 사용자 이메일 column을 수정합니다. 수정하려는 사용자의 이메일이 이미 데이터베이스에 존재한다면 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/me/email")
  async modifyUserEmail(
    @Body() { email }: ModifyUserEmailDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userOperationService.modifyUserEmail(email, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "사용자의 이메일을 수정합니다.",
    };
  }

  @ApiOperation({
    summary: "modify user nickname",
    description:
      "로그인을 했을 때 본인의 사용자 닉네임 column을 수정합니다. 수정하려는 사용자의 닉네임이 이미 데이터베이스에 존재한다면 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/me/nickname")
  async modifyUserNickName(
    @Body() { nickname }: ModifyUserNicknameDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userOperationService.modifyUserNickname(
      nickname,
      jwtPayload.userId,
    );

    return {
      statusCode: 201,
      message: "사용자의 닉네임을 수정합니다.",
    };
  }

  @ApiOperation({
    summary: "modify user phone number",
    description:
      "로그인을 했을 때 본인의 사용자 전화번호 column을 수정합니다. 수정하려는 사용자의 전화번호가 이미 데이터베이스에 존재한다면 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/me/phonenumber")
  async modifyUserPhoneNumber(
    @Body() { phonenumber }: ModifyUserPhonenumberDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userOperationService.modifyUserPhonenumber(
      phonenumber,
      jwtPayload.userId,
    );

    return {
      statusCode: 201,
      message: "사용자의 전화번호를 수정합니다.",
    };
  }

  @ApiOperation({
    summary: "modify user password",
    description: "로그인을 했을 때 본인의 사용자 비밀번호 column을 수정합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/me/password")
  async modifyUserPassword(
    @Body() { password }: ModifyUserPasswordDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userOperationService.modifyUserPassword(
      password,
      jwtPayload.userId,
    );

    return {
      statusCode: 201,
      message: "사용자의 비밀번호를 수정합니다.",
    };
  }

  @ApiOperation({ summary: "secession", description: "회원 탈퇴를 합니다." })
  @UseInterceptors(JsonJwtLogoutInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/secession")
  async secession(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonJwtLogoutInterface> {
    await this.userOperationService.deleteUser(jwtPayload.userId);

    return {
      statusCode: 203,
      message: "사용자 정보를 삭제하였습니다.",
      cookieKey: ["access_token", "refresh_token"],
    };
  }

  @ApiOperation({
    summary: "find email",
    description:
      "이메일을 찾습니다. 본인 인증을 하기 위해서 실명과 전화번호를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Get("/find-email")
  async findEmail(
    @Query("realname") realname: string,
    @Query("phonenumber") phonenumber: string,
  ): Promise<JsonGeneralInterface<string>> {
    const result = await this.userSecurity.findEmail(realname, phonenumber);

    return {
      statusCode: 200,
      message: "이메일 정보를 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "reset password",
    description:
      "비밀번호를 변경합니다. 본인의 이메일과 변경할 비밀번호를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Patch("/reset-password")
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userOperationService.resetPassword(resetPasswordDto);

    return {
      statusCode: 200,
      message: "사용자 비밀번호를 재설정 하였습니다.",
    };
  }
}
