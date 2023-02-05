import { JsonClearCookieInterface } from "../../../common/interceptors/interface/json-clear-cookie.interface";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { JwtAccessTokenPayload } from "../../auth/jwt/jwt-access-token-payload.interface";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { AuthService } from "../../auth/providers/auth.service";
import { UserService } from "../providers/user.service";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { LoginUserDto } from "../dtos/login-user.dto";
import { UserEntity } from "../entities/user.entity";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { GetJWT } from "../../../common/decorators/get.jwt.decorator";
import { FindEmailDto } from "../dtos/find-email.dto";
import { IsNotLoginGuard } from "../../../common/guards/is-not-login.guard";
import { JsonGeneralInterceptor } from "src/common/interceptors/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json-clear-cookie.interceptor";
import { IsRefreshTokenAvailableGuard } from "src/common/guards/is-refresh-token-available.guard";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { JsonJwtAuthInterceptor } from "src/common/interceptors/json-jwt-auth.interceptor";
import { JsonJwtAuthInterface } from "src/common/interceptors/interface/json-jwt-auth.interface";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";

@Controller("/api/v1/free-use/user")
export class UserVersionOneFreeUseController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/register")
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<JsonGeneralInterface<void>> {
    await this.userService.register(registerUserDto);

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
      result: await this.userService.findSelfInfoWithId(jwtPayload.userId),
    };
  }

  @UseInterceptors(JsonJwtAuthInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/login")
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<JsonJwtAuthInterface> {
    const user = await this.authService.validateUser(loginUserDto);

    const { accessToken, refreshToken } = await this.authService.signToken(
      user,
    );

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
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      jwtPayload,
    );

    return {
      statusCode: 200,
      message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
      cookieKey: ["access_token", "refresh_token"],
      cookieValue: [accessToken, refreshToken],
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/logout")
  logout(): JsonClearCookiesInterface {
    return {
      statusCode: 200,
      message: "로그아웃을 완료하였습니다.",
      cookieKey: ["access_token", "refresh_token"],
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/set-user")
  async setUser(
    @Body() patchUserDto: PatchUserDto,
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonGeneralInterface<null>> {
    await this.userService.patchUserInfoMyself(patchUserDto, jwtPayload.userId);

    return {
      statusCode: 200,
      message: "사용자 정보를 수정합니다.",
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/secession")
  async secession(
    @GetJWT() jwtPayload: JwtAccessTokenPayload,
  ): Promise<JsonClearCookieInterface> {
    await this.userService.deleteUserWithId(jwtPayload.userId);

    return {
      statusCode: 203,
      message: "사용자 정보를 삭제하였습니다.",
      cookieKey: "JWT_COOKIE",
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Get("/find-email/realname/:realname/phonenumber/:phonenumber")
  async findEmail(
    @Param() findEmailDto: FindEmailDto,
  ): Promise<JsonGeneralInterface<string>> {
    return {
      statusCode: 200,
      message: "이메일 정보를 가져옵니다.",
      result: await this.authService.findEmail(findEmailDto),
    };
  }

  @UseInterceptors(JsonGeneralInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Patch("/reset-password")
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<JsonGeneralInterface<void>> {
    await this.authService.resetPassword(resetPasswordDto);

    return {
      statusCode: 200,
      message: "사용자 비밀번호를 재설정 하였습니다.",
    };
  }
}
