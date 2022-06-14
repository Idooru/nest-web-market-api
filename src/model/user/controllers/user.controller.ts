import { AuthService } from "./../../auth/services/auth.service";
import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { LoginUserDto } from "../dtos/login-user.dto";
import { Response } from "express";
import { cookieOptions } from "src/common/config/etc";
import { JSON } from "../../../common/interfaces/json.interface";
import { UserEntity } from "../entities/user.entity";

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
    const user = await this.userService.register(registerUserDto);

    return {
      statusCode: 201,
      message: "회원가입을 완료하였습니다.",
      result: user,
    };
  }

  @Post("/login")
  async login(
    @Res() res: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<JSON<void>> {
    const jwtToken = await this.authService.login(loginUserDto);

    res.cookie("JWT_TOKEN", jwtToken, cookieOptions);
    console.log({ JWT_TOKEN: jwtToken });

    return {
      statusCode: 201,
      message: "로그인을 완료하였습니다. 쿠키를 확인하세요.",
    };
  }
}
