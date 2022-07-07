import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { JwtPayload } from "./../../../common/interfaces/jwt-payload.interface";
import { IsLoginGuard } from "../../../common/guards/is-login.guard";
import { AuthService } from "../../auth/providers/auth.service";
import { UserService } from "../providers/user.service";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { LoginUserDto } from "../dtos/login-user.dto";
import { Response } from "express";
import { CookieOption } from "../../../common/config/etc/etc.variable";
import { JsonRes } from "../../../common/interfaces/json-success.interface";
import { UserEntity } from "../entities/user.entity";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { GetDecodedJwt } from "../../../common/decorators/get-decoded-jwt.decorator";
import { FindEmailDto } from "./../dtos/find-email.dto";
import { IsNotLoginGuard } from "../../../common/guards/is-not-login.guard";

@Controller("/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(IsNotLoginGuard)
  @Post("/register")
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<JsonRes<void>> {
    await this.userService.register(registerUserDto);

    return {
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
    };
  }

  @UseGuards(IsNotLoginGuard)
  @Post("/login")
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<JsonRes<string>> {
    const jwtToken = await this.authService.login(loginUserDto);
    res.cookie("JWT_COOKIE", jwtToken, CookieOption);

    return {
      statusCode: 201,
      message: "로그인을 완료하였습니다. 쿠키를 확인하세요.",
    };
  }

  @UseGuards(IsLoginGuard)
  @Get("/profile")
  async whoAmI(
    @GetDecodedJwt() jwtPayload: JwtPayload,
  ): Promise<JsonRes<UserEntity>> {
    return {
      statusCode: 200,
      message: "본인 정보를 가져옵니다.",
      result: await this.userService.findSelfInfoWithId(jwtPayload.id),
    };
  }

  @UseGuards(IsLoginGuard)
  @Get("/refresh-token")
  async refreshToken(
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ): Promise<JsonRes<string>> {
    const jwtToken = await this.authService.refreshToken(jwtPayload);
    res.cookie("JWT_COOKIE", jwtToken, CookieOption);

    return {
      statusCode: 200,
      message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
      result: jwtPayload.id,
    };
  }

  @UseGuards(IsLoginGuard)
  @Delete("/logout")
  logout(
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ): JsonRes<string> {
    res.clearCookie("JWT_COOKIE");

    return {
      statusCode: 200,
      message: "로그아웃을 완료하였습니다.",
      result: jwtPayload.id,
    };
  }

  @UseGuards(IsLoginGuard)
  @Patch("/set-user")
  async setUser(
    @Body() patchUserDto: PatchUserDto,
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ): Promise<JsonRes<string>> {
    const jwtToken = await this.userService.patchUserInfoMyself(
      patchUserDto,
      jwtPayload.id,
    );
    res.cookie("JWT_COOKIE", jwtToken, CookieOption);

    return {
      statusCode: 200,
      message: "사용자 정보를 수정하고 토큰을 재발급합니다.",
      result: jwtPayload.id,
    };
  }

  @UseGuards(IsLoginGuard)
  @Delete("/secession")
  async secession(
    @GetDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ): Promise<JsonRes<string>> {
    await this.userService.deleteUserWithId(jwtPayload.id);

    res.clearCookie("JWT_COOKIE");

    return {
      statusCode: 203,
      message: "사용자 정보를 삭제하였습니다.",
      result: jwtPayload.id,
    };
  }

  @UseGuards(IsNotLoginGuard)
  @Get("/find-email")
  async findEmail(
    @Query() findEmailDto: FindEmailDto,
  ): Promise<JsonRes<string>> {
    return {
      statusCode: 200,
      message: "이메일 정보를 가져옵니다.",
      result: await this.authService.findEmail(findEmailDto),
    };
  }

  @UseGuards(IsNotLoginGuard)
  @Patch("/reset-password")
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<JsonRes<void>> {
    await this.authService.resetPassword(resetPasswordDto);

    return {
      statusCode: 200,
      message: "사용자 비밀번호를 재설정 하였습니다.",
    };
  }
}
