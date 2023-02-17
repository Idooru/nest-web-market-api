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
import { AuthGeneralService } from "../../../auth/services/auth-general.service";
import { UserGeneralService } from "../../services/user-general.service";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { LoginUserDto } from "../../dtos/login-user.dto";
import { UserEntity } from "../../entities/user.entity";
import { ModifyUserDto } from "../../dtos/modify-user.dto";
import { ResetPasswordDto } from "../../dtos/reset-password.dto";
import { GetJWT } from "../../../../common/decorators/get.jwt.decorator";
import { IsNotLoginGuard } from "../../../../common/guards/authenticate/is-not-login.guard";
import { IsRefreshTokenAvailableGuard } from "src/common/guards/authenticate/is-refresh-token-available.guard";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { verifyCookieKeys } from "src/common/config/cookie-key-configs";
import { VerifyDataGuard } from "src/common/guards/verfiy/verify-data.guard";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/general/interface/json-general-interface";
import { JsonJwtAuthInterface } from "src/common/interceptors/general/interface/json-jwt-auth.interface";
import { JsonJwtAuthInterceptor } from "src/common/interceptors/general/json-jwt-auth.interceptor";
import { JsonJwtLogoutInterceptor } from "src/common/interceptors/general/json-jwt-logout.interceptor";
import { JsonJwtLogoutInterface } from "src/common/interceptors/general/interface/json-jwt-logout.interface";

@Controller("/api/v1/free-use/user")
export class UserVersionOneFreeUseController {
  constructor(
    private readonly userGeneralService: UserGeneralService,
    private readonly authGeneralService: AuthGeneralService,
  ) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      verifyCookieKeys.user.is_not_exist.email_executed,
      verifyCookieKeys.user.is_not_exist.nickname_executed,
      verifyCookieKeys.user.is_not_exist.phonenumber_executed,
    ),
  )
  @UseGuards(IsNotLoginGuard)
  @Post("/register")
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userGeneralService.register(registerUserDto);

    return {
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Get("/profile")
  async whoAmI(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<UserEntity>> {
    return {
      statusCode: 200,
      message: "본인 정보를 가져옵니다.",
      result: await this.userGeneralService.findSelfInfoWithId(
        jwtPayload.userId,
      ),
    };
  }

  @UseInterceptors(JsonJwtAuthInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/login")
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<JsonJwtAuthInterface> {
    const user = await this.authGeneralService.validateUser(loginUserDto);

    const { accessToken, refreshToken } =
      await this.authGeneralService.signToken(user);

    return {
      statusCode: 201,
      message: "로그인을 완료하였습니다. 쿠키를 확인하세요.",
      cookieKey: ["access_token", "refresh_token"],
      cookieValue: [accessToken, refreshToken],
    };
  }

  @UseInterceptors(JsonJwtAuthInterceptor)
  @UseGuards(IsRefreshTokenAvailableGuard)
  @Get("/refresh-token")
  async refreshToken(
    @GetJWT() jwtPayload: JwtRefreshTokenPayload,
  ): Promise<JsonJwtAuthInterface> {
    const { accessToken, refreshToken } =
      await this.authGeneralService.refreshToken(jwtPayload);

    return {
      statusCode: 200,
      message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
      cookieKey: ["access_token", "refresh_token"],
      cookieValue: [accessToken, refreshToken],
    };
  }

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

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      verifyCookieKeys.user.is_not_exist.email_executed,
      verifyCookieKeys.user.is_not_exist.nickname_executed,
      verifyCookieKeys.user.is_not_exist.phonenumber_executed,
    ),
  )
  @UseGuards(IsLoginGuard)
  @Put("/me")
  async modifyUser(
    @Body() modifyUserDto: ModifyUserDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userGeneralService.modifyUser(modifyUserDto, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "사용자 정보를 수정합니다.",
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(verifyCookieKeys.user.is_not_exist.email_executed),
  )
  @UseGuards(IsLoginGuard)
  @Patch("/me/email")
  async modifyUserEmail(
    @Body("email") email: string,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userGeneralService.modifyUserEmail(email, jwtPayload.userId);

    return {
      statusCode: 201,
      message: "사용자의 이메일을 수정합니다.",
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(verifyCookieKeys.user.is_not_exist.nickname_executed),
  )
  @Patch("/me/nickname")
  async modifyUserNickName(
    @Body("nickname") nickname: string,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userGeneralService.modifyUserNickName(
      nickname,
      jwtPayload.userId,
    );

    return {
      statusCode: 201,
      message: "사용자의 닉네임을 수정합니다.",
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      verifyCookieKeys.user.is_not_exist.phonenumber_executed,
    ),
  )
  @Patch("/me/phonenumber")
  async modifyUserPhoneNumber(
    @Body("phonenumber") phonenumber: string,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userGeneralService.modifyUserPhoneNumber(
      phonenumber,
      jwtPayload.userId,
    );

    return {
      statusCode: 201,
      message: "사용자의 전화번호를 수정합니다.",
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @Patch("/me/password")
  async modifyUserPassword(
    @Body("password") password: string,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userGeneralService.modifyUserPassword(
      password,
      jwtPayload.userId,
    );

    return {
      statusCode: 201,
      message: "사용자의 비밀번호를 수정합니다.",
    };
  }

  @UseInterceptors(JsonJwtLogoutInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.user.is_exist.id_executed))
  @UseGuards(IsLoginGuard)
  @Delete("/secession")
  async secession(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonJwtLogoutInterface> {
    await this.userGeneralService.deleteUserWithId(jwtPayload.userId);

    return {
      statusCode: 203,
      message: "사용자 정보를 삭제하였습니다.",
      cookieKey: ["access_token", "refresh_token"],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(
    new VerifyDataGuard(
      verifyCookieKeys.user.is_exist.realname_executed,
      verifyCookieKeys.user.is_exist.phonenumber_executed,
    ),
  )
  @UseGuards(IsNotLoginGuard)
  @Get("/find-email")
  async findEmail(
    @Query("realname") realname: string,
    @Query("phonenumber") phonenumber: string,
  ): Promise<JsonGeneralInterface<string>> {
    const findEmailDto = { realname, phonenumber };

    return {
      statusCode: 200,
      message: "이메일 정보를 가져옵니다.",
      result: await this.authGeneralService.findEmail(findEmailDto),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(new VerifyDataGuard(verifyCookieKeys.user.is_exist.email_executed))
  @UseGuards(IsNotLoginGuard)
  @Patch("/reset-password")
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<JsonGeneralInterface<void>> {
    await this.authGeneralService.resetPassword(resetPasswordDto);

    return {
      statusCode: 200,
      message: "사용자 비밀번호를 재설정 하였습니다.",
    };
  }
}
