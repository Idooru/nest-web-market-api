import { Body, Controller, Delete, Get, Patch, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
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
import { LoginInterface } from "src/common/interceptors/interface/login.interface";
import { LogoutInterface } from "src/common/interceptors/interface/logout.interface";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { UserEntity } from "../../entities/user.entity";
import { ModifyUserEmailDto } from "../../dtos/modify-user-email.dto";
import { ModifyUserNicknameDto } from "../../dtos/modify-user-nickName.dto";
import { ModifyUserPhonenumberDto } from "../../dtos/modify-user-phoneNumber.dto";
import { ModifyUserPasswordDto } from "../../dtos/modify-user-password.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserTransactionExecutor } from "../../logic/transaction/user-transaction.executor";
import { UserSearcher } from "../../logic/user.searcher";
import { UserService } from "../../services/user.service";
import { OperateUserValidationPipe } from "../../pipe/none-exist/operate-user-validation.pipe";
import { UserEmailValidatePipe } from "../../pipe/none-exist/user-email-validate.pipe";
import { UserBodyPhoneNumberValidatePipe } from "../../pipe/none-exist/user-phoneNumber-validate.pipe";
import { UserNicknameValidatePipe } from "../../pipe/none-exist/user-nickName-validate.pipe";
import { LoginInterceptor } from "../../../../common/interceptors/general/login.interceptor";
import { RefreshTokenInterceptor } from "../../../../common/interceptors/general/refresh-token.interceptor";
import { LogoutInterceptor } from "../../../../common/interceptors/general/logout.interceptor";
import { RefreshTokenInterface } from "../../../../common/interceptors/interface/refresh-token.interface";
import { ModifyUserAddressDto } from "../../dtos/modify-user-address.dto";
import { FindEmailDto } from "../../dtos/find-email.dto";
import { FindEmailValidationPipe } from "../../pipe/exist/find-email-validation.pipe";
import { UserSecurity } from "../../logic/user.security";
import { UserRegisterEventInterceptor } from "../../interceptor/user-register-event.interceptor";
import { LogoutGuard } from "../../../../common/guards/authenticate/logout.guard";

@ApiTags("v1 공용 User API")
@Controller({ path: "/user", version: "1" })
export class UserV1Controller {
  constructor(
    private readonly transaction: UserTransactionExecutor,
    private readonly searcher: UserSearcher,
    private readonly userSecurity: UserSecurity,
    private readonly service: UserService,
  ) {}

  @ApiOperation({
    summary: "register",
    description: "회원 가입을 합니다.",
  })
  @ApiResponse({ status: 201, description: "회원가입 성공" })
  @ApiResponse({ status: 400, description: "입력값 부재, 중복으로 인한 실패" })
  @UseInterceptors(JsonGeneralInterceptor, UserRegisterEventInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/register")
  public async register(
    @Body(OperateUserValidationPipe<RegisterUserDto>) dto: RegisterUserDto,
  ): Promise<JsonGeneralInterface<void>> {
    await this.transaction.register(dto);

    return {
      statusCode: 201,
      message: "사용자 회원가입을 완료하였습니다.",
    };
  }

  @ApiOperation({
    summary: "get my profile",
    description: "본인의 프로필 정보를 가져옵니다. 본인 계정의 권한에 해당되는 정보를 가져옵니다.",
  })
  @ApiResponse({ status: 200, description: "프로필 가져오기 성공" })
  @ApiResponse({ status: 401, description: "access 토큰 부재로 인한 실패" })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Get("/profile")
  public async findProfile(@GetJWT() jwtPayload: JwtAccessTokenPayload): Promise<JsonGeneralInterface<UserEntity>> {
    const result = await this.searcher.findUserProfile(jwtPayload);

    return {
      statusCode: 200,
      message: "사용자 정보를 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "login",
    description: "로그인을 합니다. access token과 refresh token이 담겨진 쿠키를 얻습니다.",
  })
  @ApiResponse({ status: 201, description: "로그인 성공" })
  @ApiResponse({ status: 400, description: "아이디 비밀번호 불일치로 인한 실패" })
  @UseInterceptors(LoginInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/login")
  public async login(@Body() dto: LoginUserDto): Promise<LoginInterface> {
    const accessToken = await this.userSecurity.login(dto);

    return {
      statusCode: 201,
      message: "로그인을 완료하였습니다. 쿠키를 확인하세요.",
      accessToken,
    };
  }

  @ApiOperation({
    summary: "refresh token",
    description:
      "access token을 재발급 받습니다. access token의 유효기간이 끝났다고 클라이언트에서 판단하면 이 api를 호출 할 수 있도록 합니다. 만약 refresh token의 유효기간이 끝났을 때 이 api를 호출 하면 access token, refresh token이 담긴 쿠키를 제거하여 로그아웃 됩니다.",
  })
  @ApiResponse({ status: 200, description: "토큰 재발급 성공" })
  @ApiResponse({ status: 401, description: "refresh 토큰 부재로 인한 실패" })
  @UseInterceptors(RefreshTokenInterceptor)
  @UseGuards(IsRefreshTokenAvailableGuard)
  @Patch("/refresh-token")
  public async refreshToken(@GetJWT() { email }: JwtRefreshTokenPayload): Promise<RefreshTokenInterface> {
    const accessToken = await this.userSecurity.refreshToken(email);

    return {
      statusCode: 200,
      message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
      accessToken,
    };
  }

  @ApiOperation({
    summary: "logout",
    description: "로그아웃을 합니다. access token, refresh token이 담긴 쿠키를 제거합니다.",
  })
  @ApiResponse({ status: 200, description: "로그아웃 성공" })
  @ApiResponse({ status: 401, description: "access 토큰 부재로 인한 실패" })
  @UseInterceptors(LogoutInterceptor)
  @UseGuards(LogoutGuard)
  @Delete("/logout")
  public async logout(@GetJWT() { userId }: JwtAccessTokenPayload): Promise<JsonGeneralInterface<null>> {
    await this.userSecurity.logout(userId);

    return {
      statusCode: 200,
      message: "로그아웃을 완료하였습니다.",
    };
  }

  @ApiOperation({
    summary: "modify user",
    description:
      "로그인을 했을 때 본인의 사용자 전체 column을 수정합니다. 만일 모든 필드가 변경되었을 시 이 API를 호출할 수 있도록 합니다.",
  })
  @ApiResponse({ status: 201, description: "사용자 정보 수정 성공" })
  @ApiResponse({ status: 400, description: "입력값 부재, 중복 으로 인한 실패" })
  @ApiResponse({ status: 401, description: "access 토큰 부재로 인한 실패" })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Put("/me")
  public async modifyUser(
    @Body(OperateUserValidationPipe<ModifyUserDto>)
    modifyUserDto: ModifyUserDto,
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    const dto = {
      modifyUserDto,
      id: userId,
    };

    await this.transaction.modifyUser(dto);

    return {
      statusCode: 201,
      message: "사용자 정보를 수정합니다.",
    };
  }

  @ApiOperation({
    summary: "modify user email",
    description: "로그인을 했을 때 본인의 사용자 이메일 column을 수정합니다. ",
  })
  @ApiResponse({ status: 201, description: "사용자 이메일 수정 성공" })
  @ApiResponse({ status: 400, description: "입력값 부재, 중복 으로 인한 실패" })
  @ApiResponse({ status: 401, description: "access 토큰 부재로 인한 실패" })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/me/email")
  public async modifyUserEmail(
    @Body(UserEmailValidatePipe) { email }: ModifyUserEmailDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.service.modifyUserEmail(email, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "사용자의 이메일을 수정합니다.",
    };
  }

  @ApiOperation({
    summary: "modify user nickName",
    description:
      "로그인을 했을 때 본인의 사용자 닉네임 column을 수정합니다. 수정하려는 사용자의 닉네임이 이미 데이터베이스에 존재한다면 에러를 반환합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/me/nickName")
  public async modifyUserNickname(
    @Body(UserNicknameValidatePipe) { nickName }: ModifyUserNicknameDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.service.modifyUserNickname(nickName, jwtPayload.userId);

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
  @Patch("/me/phone-number")
  public async modifyUserPhoneNumber(
    @Body(UserBodyPhoneNumberValidatePipe)
    { phoneNumber }: ModifyUserPhonenumberDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.service.modifyUserPhoneNumber(phoneNumber, jwtPayload.userId);

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
  public async modifyUserPassword(
    @Body() { password }: ModifyUserPasswordDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.service.modifyUserPassword(password, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "사용자의 비밀번호를 수정합니다.",
    };
  }

  @ApiOperation({
    summary: "modify user address",
    description: "로그인을 했을 때 본인의 사용자 집주소 column을 수정합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/me/address")
  public async modifyUserAddress(
    @Body() { address }: ModifyUserAddressDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.service.modifyUserAddress(address, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "사용자의 집주소를 수정합니다.",
    };
  }

  @ApiOperation({ summary: "secession", description: "회원 탈퇴를 합니다." })
  @UseInterceptors(LogoutInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/secession")
  public async secession(@GetJWT() jwtPayload: JwtAccessTokenPayload): Promise<LogoutInterface> {
    await this.service.deleteUser(jwtPayload.userId);

    return {
      statusCode: 203,
      message: "사용자 정보를 삭제하였습니다.",
      cookieKey: ["access_token", "refresh_token"],
    };
  }

  @ApiOperation({
    summary: "find email",
    description: "이메일을 찾습니다. 본인 인증을 하기 위해서 실명과 전화번호를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Get("/find-email")
  public async findEmail(
    @Query(FindEmailValidationPipe<FindEmailDto>) query: FindEmailDto,
  ): Promise<JsonGeneralInterface<string>> {
    const result = await this.userSecurity.findEmail(query);

    return {
      statusCode: 200,
      message: "이메일 정보를 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "reset password",
    description: "비밀번호를 변경합니다. 본인의 이메일과 변경할 비밀번호를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Patch("/reset-password")
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<JsonGeneralInterface<void>> {
    await this.service.resetPassword(resetPasswordDto);

    return {
      statusCode: 200,
      message: "사용자 비밀번호를 재설정 하였습니다.",
    };
  }
}
