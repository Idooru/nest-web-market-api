import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { UserVerifyService } from "../../services/user-verify.service";
import { SendVerifyCookieInterceptor } from "src/common/interceptors/verify/send-verify-cookie.interceptor";
import { VerifyDataDto } from "src/common/interceptors/verify/verify-data.dto";
import { verifyCookieKeys } from "src/common/config/cookie-key-configs";

@Controller("/api/v1/verify/user")
export class UserVersionOneVerifyController {
  constructor(private readonly userVerifyService: UserVerifyService) {}

  private readonly userVerifyCookieKey = verifyCookieKeys.user;

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/id/:id")
  async isExistUserId(@Param("id") userId: string): Promise<VerifyDataDto> {
    await this.userVerifyService.isExistUserId(userId);

    return {
      message: "해당 사용자가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_exist.id_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/email/:email")
  async isExistUserEmail(
    @Param("email") email: string,
  ): Promise<VerifyDataDto> {
    await this.userVerifyService.isExistUserEmail(email);

    return {
      message: "해당 이메일이 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_exist.email_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/email/:email")
  async isNotExistUserEmail(
    @Param("email") email: string,
  ): Promise<VerifyDataDto> {
    await this.userVerifyService.isNotExistUserEmail(email);

    return {
      message:
        "해당 이메일이 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_not_exist.email_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/realname/:realname")
  async isExistUserRealName(
    @Param("realname") realname: string,
  ): Promise<VerifyDataDto> {
    await this.userVerifyService.isExistUserRealName(realname);

    return {
      message: "해당 실명이 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_exist.realname_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/nickname/:nickname")
  async isNotExistUserNickName(
    @Param("nickname") nickname: string,
  ): Promise<VerifyDataDto> {
    await this.userVerifyService.isNotExistUserNickName(nickname);

    return {
      message:
        "해당 닉네임이 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_not_exist.nickname_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/phonenumber/:phonenumber")
  async isExistUserPhoneNumber(
    @Param("phonenumber") phonenumber: string,
  ): Promise<VerifyDataDto> {
    await this.userVerifyService.isExistUserPhoneNumber(phonenumber);

    return {
      message: "해당 전화번호가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_exist.phonenumber_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/phonenumber/:phonenumber")
  async isNotExistUserPhoneNumber(
    @Param("phonenumber") phonenumber: string,
  ): Promise<VerifyDataDto> {
    await this.userVerifyService.isNotExistUserPhoneNumber(phonenumber);

    return {
      message:
        "해당 전화번호가 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_not_exist.phonenumber_executed,
    };
  }
}
