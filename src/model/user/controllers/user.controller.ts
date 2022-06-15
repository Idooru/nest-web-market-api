import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { JwtPayload } from "./../../../common/interfaces/jwt-payload.interface";
import { IsLoginGuard } from "./../../../common/guards/isLogin.guard";
import { AuthService } from "./../../auth/services/auth.service";
import { UserService } from "../services/user.service";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { LoginUserDto } from "../dtos/login-user.dto";
import { Response } from "express";
import { CookieOption } from "src/common/config/etc";
import { JSON } from "../../../common/interfaces/json.interface";
import { UserEntity } from "../entities/user.entity";
import { getDecodedJwt } from "src/common/decorators/get-decoded-jwt.decorator";
import { ResponseUserDto } from "../dtos/response-user.dto";
import { PatchUserDto } from "../dtos/patch-user.dto";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("/register")
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<JSON<UserEntity>> {
    await this.userService.register(registerUserDto);
    return {
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
    };
  }

  @Post("/login")
  async login(
    @Res() res: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<JSON<void>> {
    const jwtToken = await this.authService.login(loginUserDto);

    res.cookie("JWT_COOKIE", jwtToken, CookieOption);
    console.log({ JWT_COOKIE: jwtToken });

    return {
      statusCode: 201,
      message: "로그인을 완료하였습니다. 쿠키를 확인하세요.",
    };
  }

  @UseGuards(IsLoginGuard)
  @Get("/whoami")
  async whoAmI(
    @getDecodedJwt() user: JwtPayload,
  ): Promise<JSON<ResponseUserDto[]>> {
    return {
      statusCode: 200,
      message: "본인 정보를 가져옵니다.",
      result: await this.userService.findSelfInfoWithId(user.id),
    };
  }

  @UseGuards(IsLoginGuard)
  @Get("/refresh-token")
  async refreshToken(
    @getDecodedJwt() user: JwtPayload,
    @Res() res: Response,
  ): Promise<JSON<void>> {
    const jwtToken = await this.authService.refreshToken(user);

    res.cookie("JWT_COOKIE", jwtToken, CookieOption);
    console.log({ JWT_COOKIE: jwtToken });

    return {
      statusCode: 200,
      message: "토큰을 재발급 받았습니다. 쿠키를 확인하세요.",
    };
  }

  @UseGuards(IsLoginGuard)
  @Delete("/logout")
  logout(@Res() res: Response): JSON<void> {
    res.clearCookie("JWT_COOKIE");

    return {
      statusCode: 200,
      message: "로그아웃을 완료하였습니다.",
    };
  }

  @UseGuards(IsLoginGuard)
  @Patch("/set-user")
  async setUser(
    @Body() patchUserDto: PatchUserDto,
    @getDecodedJwt() jwtPayload: JwtPayload,
    @Res() res: Response,
  ): Promise<any> {
    const jwtToken = await this.userService.patchUser(
      patchUserDto,
      jwtPayload.id,
    );

    res.cookie("JWT_COOKIE", jwtToken, CookieOption);
    console.log({ JWT_COOKIE: jwtToken });

    return {
      statusCode: 200,
      message: "사용자 정보를 수정하고 토큰을 재발급합니다.",
    };
  }
}
