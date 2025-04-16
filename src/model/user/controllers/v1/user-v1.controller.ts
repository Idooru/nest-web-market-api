import {
  BadRequestException,
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
import { GetJWT } from "../../../../common/decorators/get.jwt.decorator";
import { IsNotLoginGuard } from "../../../../common/guards/authenticate/is-not-login.guard";
import { IsRefreshTokenAvailableGuard } from "src/common/guards/authenticate/is-refresh-token-available.guard";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { LoginInterface } from "src/common/interceptors/interface/login.interface";
import { LogoutInterface } from "src/common/interceptors/interface/logout.interface";
import { ApiTags } from "@nestjs/swagger";
import { UserTransactionExecutor } from "../../logic/transaction/user-transaction.executor";
import { UserSearcher } from "../../logic/user.searcher";
import { UserService } from "../../services/user.service";
import { UserEmailValidatePipe as UserEmailNoneExistValidatePipe } from "../../pipe/none-exist/user-email-validate.pipe";
import { UserBodyPhoneNumberValidatePipe } from "../../pipe/none-exist/user-phoneNumber-validate.pipe";
import { UserNicknameValidatePipe } from "../../pipe/none-exist/user-nickName-validate.pipe";
import { LoginInterceptor } from "../../../../common/interceptors/general/login.interceptor";
import { RefreshTokenInterceptor } from "../../../../common/interceptors/general/refresh-token.interceptor";
import { LogoutInterceptor } from "../../../../common/interceptors/general/logout.interceptor";
import { RefreshTokenInterface } from "../../../../common/interceptors/interface/refresh-token.interface";
import { FindEmailValidationPipe } from "../../pipe/exist/find-email-validation.pipe";
import { UserSecurity } from "../../logic/user.security";
import { UserRegisterEventInterceptor } from "../../interceptor/user-register-event.interceptor";
import { LogoutGuard } from "../../../../common/guards/authenticate/logout.guard";
import { RegisterSwagger } from "../../docs/user-v1-controller/register.swagger";
import { ProfileSwagger } from "../../docs/user-v1-controller/profile.swagger";
import { LoginSwagger } from "../../docs/user-v1-controller/login.swagger";
import { FindForgottenEmailSwagger } from "../../docs/user-v1-controller/find-forgotten-email.swagger";
import { RefreshTokenSwagger } from "../../docs/user-v1-controller/refresh-token.swagger";
import { LogoutSwagger } from "../../docs/user-v1-controller/logout.swagger";
import { ModifyUserSwagger } from "../../docs/user-v1-controller/modify-user.swagger";
import { ModifyUserEmailSwagger } from "../../docs/user-v1-controller/modify-user-email.swagger";
import { ModifyUserNickNameSwagger } from "../../docs/user-v1-controller/modify-user-nick-name.swagger";
import { ModifyUserPhoneNumberSwagger } from "../../docs/user-v1-controller/modify-user-phone-number.swagger";
import { ModifyUserPasswordSwagger } from "../../docs/user-v1-controller/modify-user-password.swagger";
import { ModifyUserAddressSwagger } from "../../docs/user-v1-controller/modify-user-address.swagger";
import { SecessionSwagger } from "../../docs/user-v1-controller/secession.swagger";
import { ResetPasswordSwagger } from "../../docs/user-v1-controller/reset-password.swagger";
import { RegisterUserDto } from "../../dto/request/register-user.dto";
import { BasicAuthDto } from "../../dto/request/basic-auth.dto";
import { ModifyUserBody } from "../../dto/request/modify-user.dto";
import { ModifyUserEmailDto } from "../../dto/request/modify-user-email.dto";
import { ModifyUserNicknameDto } from "../../dto/request/modify-user-nickname.dto";
import { ModifyUserPhoneNumberDto } from "../../dto/request/modify-user-phonenumber.dto";
import { ModifyUserPasswordDto } from "../../dto/request/modify-user-password.dto";
import { ModifyUserAddressDto } from "../../dto/request/modify-user-address.dto";
import { FindEmailDto } from "../../dto/request/find-email.dto";
import { UserProfileRawDto } from "../../dto/response/user-profile-raw.dto";
import { GetBasicAuth } from "../../../../common/decorators/get-basic-auth.decorator";
import { UserValidator } from "../../logic/user.validator";

type UserValidateBody = {
  email: string;
  nickName: string;
  phoneNumber: string;
};

@ApiTags("v1 공용 User API")
@Controller({ path: "/user", version: "1" })
export class UserV1Controller {
  constructor(
    private readonly transaction: UserTransactionExecutor,
    private readonly searcher: UserSearcher,
    private readonly userSecurity: UserSecurity,
    private readonly service: UserService,
    private readonly userValidator: UserValidator,
  ) {}

  private async validateUserBody<T extends UserValidateBody>(dto: T): Promise<void> {
    const { email, nickName, phoneNumber } = dto;

    const validResult = await Promise.allSettled([
      this.userValidator.isNoneExistEmail(email),
      this.userValidator.isNoneExistNickname(nickName),
      this.userValidator.isNoneExistPhoneNumber(phoneNumber),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new BadRequestException(errors);
    }
  }

  // @RegisterSwagger()
  @UseInterceptors(JsonGeneralInterceptor, UserRegisterEventInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/register")
  public async register(
    @Body() registerUserDto: RegisterUserDto,
    @GetBasicAuth() basicAuthDto: BasicAuthDto,
  ): Promise<JsonGeneralInterface<void>> {
    registerUserDto = { ...registerUserDto, ...basicAuthDto };

    await this.validateUserBody(registerUserDto);
    await this.transaction.register(registerUserDto);

    return {
      statusCode: 201,
      message: "사용자 회원가입을 완료하였습니다.",
    };
  }

  // @ProfileSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Get("/profile")
  public async findProfile(
    @GetJWT() { userId }: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<UserProfileRawDto>> {
    const result = await this.searcher.findUserProfileRaw(userId);

    return {
      statusCode: 200,
      message: "사용자 정보를 가져옵니다.",
      result,
    };
  }

  // @LoginSwagger()
  @UseInterceptors(LoginInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/login")
  public async login(@GetBasicAuth() dto: BasicAuthDto): Promise<LoginInterface> {
    const accessToken = await this.userSecurity.login(dto);

    return {
      statusCode: 201,
      message: "로그인을 완료하였습니다. 쿠키를 확인하세요.",
      accessToken,
    };
  }

  @RefreshTokenSwagger()
  @UseInterceptors(RefreshTokenInterceptor)
  @UseGuards(IsRefreshTokenAvailableGuard)
  @Patch("/refresh-token")
  public async refreshToken(@GetJWT() { userId }: JwtRefreshTokenPayload): Promise<RefreshTokenInterface> {
    const accessToken = await this.userSecurity.refreshToken(userId);

    return {
      statusCode: 200,
      message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
      accessToken,
    };
  }

  // @LogoutSwagger()
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

  // @ModifyUserSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Put("/me")
  public async modifyUser(
    @Body() modifyUserBody: ModifyUserBody,
    @GetJWT() { userId }: JwtAccessTokenPayload,
    @GetBasicAuth() basicAuthDto: BasicAuthDto,
  ): Promise<JsonGeneralInterface<void>> {
    const body = {
      ...modifyUserBody,
      ...basicAuthDto,
    };

    const modifyUserDto = {
      id: userId,
      body,
    };

    await this.validateUserBody(body);
    await this.transaction.modifyUser(modifyUserDto);

    return {
      statusCode: 201,
      message: "사용자 정보를 수정합니다.",
    };
  }

  // @ModifyUserEmailSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/me/email")
  public async modifyUserEmail(
    @Body(UserEmailNoneExistValidatePipe) { email }: ModifyUserEmailDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.service.modifyUserEmail(email, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "사용자의 이메일을 수정합니다.",
    };
  }

  // @ModifyUserNickNameSwagger()
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

  // @ModifyUserPhoneNumberSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/me/phone-number")
  public async modifyUserPhoneNumber(
    @Body(UserBodyPhoneNumberValidatePipe)
    { phoneNumber }: ModifyUserPhoneNumberDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.service.modifyUserPhoneNumber(phoneNumber, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "사용자의 전화번호를 수정합니다.",
    };
  }

  // @ModifyUserPasswordSwagger()
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

  // @ModifyUserAddressSwagger()
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

  // @SecessionSwagger()
  @UseInterceptors(LogoutInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/secession")
  public async secession(@GetJWT() jwtPayload: JwtAccessTokenPayload): Promise<LogoutInterface> {
    await this.service.deleteUser(jwtPayload.userId);

    return {
      statusCode: 200,
      message: "사용자 정보를 삭제하였습니다.",
      cookieKey: ["access_token", "refresh_token"],
    };
  }

  // @FindForgottenEmailSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Get("/forgotten-email")
  public async findForgottenEmail(
    @Query(FindEmailValidationPipe<FindEmailDto>) query: FindEmailDto,
  ): Promise<JsonGeneralInterface<string>> {
    const result = await this.userSecurity.findForgottenEmail(query);

    return {
      statusCode: 200,
      message: "이메일 정보를 가져옵니다.",
      result,
    };
  }

  // @ResetPasswordSwagger()
  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Patch("/reset-password")
  public async resetPassword(@GetBasicAuth() dto: BasicAuthDto): Promise<JsonGeneralInterface<void>> {
    await this.service.resetPassword(dto);

    return {
      statusCode: 200,
      message: "사용자 비밀번호를 재설정 하였습니다.",
    };
  }
}
