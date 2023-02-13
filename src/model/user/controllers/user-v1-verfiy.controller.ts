import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { UserVerifyService } from "../services/user-verify.service";
import { SendVerifyCookieInterceptor } from "src/common/interceptors/verify/send-verify-cookie.interceptor";
import { VerifyDataDto } from "src/common/interceptors/verify/verfiy-data.dto";
import { verifyCookieKeys } from "src/common/config/cookie-key-configs";

@Controller("/api/v1/verify/user")
export class UserVersionOneVerifyController {
  constructor(private readonly userExistService: UserVerifyService) {}

  private readonly userVerifyCookieKey = verifyCookieKeys.user;

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/id/:id")
  async isExistUserId(@Param("id") userId: string): Promise<VerifyDataDto> {
    await this.userExistService.isExistUserId(userId);

    return {
      message: "해당 사용자가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_exist.userid_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/email/:email")
  async isExistEmail(@Param("email") email: string): Promise<VerifyDataDto> {
    await this.userExistService.isExistEmail(email);

    return {
      message: "해당 이메일이 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_exist.email_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/email/:email")
  async isNotExistEmail(@Param("email") email: string): Promise<VerifyDataDto> {
    await this.userExistService.isNotExistEmail(email);

    return {
      message:
        "해당 이메일이 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_not_exist.email_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/nickname/:nickname")
  async isNotExistNickName(
    @Param("nickname") nickname: string,
  ): Promise<VerifyDataDto> {
    await this.userExistService.isNotExistNickName(nickname);

    return {
      message:
        "해당 닉네임이 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_not_exist.nickname_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/phonenumber/:phonenumber")
  async isExistPhoneNumber(
    @Param("phonenumber") phonenumber: string,
  ): Promise<VerifyDataDto> {
    await this.userExistService.isExistPhoneNumber(phonenumber);

    return {
      message: "해당 전화번호가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_exist.phonenumber_executed,
    };
  }

  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/phonenumber/:phonenumber")
  async isNotExistPhoneNumber(
    @Param("phonenumber") phonenumber: string,
  ): Promise<VerifyDataDto> {
    await this.userExistService.isNotExistPhoneNumber(phonenumber);

    return {
      message:
        "해당 전화번호가 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.userVerifyCookieKey.is_not_exist.phonenumber_executed,
    };
  }
}
