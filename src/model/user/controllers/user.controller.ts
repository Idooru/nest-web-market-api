import { JsonClearCookieInterface } from "./../../../common/interfaces/json.clear.cookie.interface";
import { JsonSendCookieInterface } from "./../../../common/interfaces/json.send.cookie.interface";
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { JwtPayload } from "../../../common/interfaces/jwt.payload.interface";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { AuthService } from "../../auth/providers/auth.service";
import { UserService } from "../providers/user.service";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { LoginUserDto } from "../dtos/login-user.dto";
import { UserEntity } from "../entities/user.entity";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { GetJWT } from "../../../common/decorators/get.jwt.decorator";
import { FindEmailDto } from "./../dtos/find-email.dto";
import { IsNotLoginGuard } from "../../../common/guards/is-not-login.guard";
import { JsonSendCookieInterceptor } from "src/common/interceptors/json.send.cookie.interceptor";
import { JsonGeneralInterceptor } from "src/common/interceptors/json.general.interceptor";
import { JsonClearCookieInterceptor } from "src/common/interceptors/json.clear.cookie.interceptor";
import { JsonGeneralInterface } from "src/common/interfaces/json.general.interface";

@Controller("/user")
export class UserController {
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
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonGeneralInterface<UserEntity>> {
    return {
      statusCode: 200,
      message: "본인 정보를 가져옵니다.",
      result: await this.userService.findSelfInfoWithId(jwtPayload.userId),
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseGuards(IsNotLoginGuard)
  @Post("/login")
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<JsonSendCookieInterface<string>> {
    const jwtToken = await this.authService.login(loginUserDto);

    return {
      statusCode: 201,
      message: "로그인을 완료하였습니다. 쿠키를 확인하세요.",
      cookieKey: "JWT_COOKIE",
      cookieValue: jwtToken,
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Get("/refresh-token")
  async refreshToken(
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonSendCookieInterface<string>> {
    const jwtToken = await this.authService.refreshToken(jwtPayload);

    return {
      statusCode: 200,
      message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
      cookieKey: "JWT_COOKIE",
      cookieValue: jwtToken,
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/logout")
  logout(): JsonClearCookieInterface {
    return {
      statusCode: 200,
      message: "로그아웃을 완료하였습니다.",
      cookieKey: "JWT_COOKIE",
    };
  }

  @UseInterceptors(JsonSendCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Patch("/set-user")
  async setUser(
    @Body() patchUserDto: PatchUserDto,
    @GetJWT() jwtPayload: JwtPayload,
  ): Promise<JsonSendCookieInterface<string>> {
    const jwtToken = await this.userService.patchUserInfoMyself(
      patchUserDto,
      jwtPayload.userId,
    );

    return {
      statusCode: 200,
      message: "사용자 정보를 수정하고 토큰을 재발급합니다.",
      cookieKey: "JWT_COOKIE",
      cookieValue: jwtToken,
    };
  }

  @UseInterceptors(JsonClearCookieInterceptor)
  @UseGuards(IsLoginGuard)
  @Delete("/secession")
  async secession(
    @GetJWT() jwtPayload: JwtPayload,
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
  @Get("/find-email")
  async findEmail(
    @Query() findEmailDto: FindEmailDto,
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
