import {
  Controller,
  Get,
  Inject,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { UserVerifyService } from "../../services/user-verify.service";
import { SendVerifyCookieInterceptor } from "src/common/interceptors/verify/send-verify-cookie.interceptor";
import { VerifyDataInterface } from "src/common/interceptors/interface/verify-data.dto";
import { UserVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/user-verify-cookie.key";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("v1 검증 User API")
@Controller("/api/v1/verify/user")
export class UserVersionOneVerifyController {
  constructor(
    @Inject("UserVerifyCookieKey") private readonly verify: UserVerifyCookieKey,
    private readonly userVerifyService: UserVerifyService,
  ) {}

  @ApiOperation({
    summary: "is exist user id",
    description:
      "파라미터로 받은 사용자의 아이디가 데이터베이스에 존재하는지 검증합니다.",
  })
  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/id/:id")
  async isExistUserId(
    @Param("id") userId: string,
  ): Promise<VerifyDataInterface> {
    await this.userVerifyService.isExistUserId(userId);

    return {
      message: "해당 사용자가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.verify.is_exist.id_executed,
    };
  }

  @ApiOperation({
    summary: "is exist user email",
    description:
      "파라미터로 받은 사용자의 이메일이 데이터베이스에 존재하는지 검증합니다.",
  })
  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/email/:email")
  async isExistUserEmail(
    @Param("email") email: string,
  ): Promise<VerifyDataInterface> {
    await this.userVerifyService.isExistUserEmail(email);

    return {
      message: "해당 이메일이 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.verify.is_exist.email_executed,
    };
  }

  @ApiOperation({
    summary: "is not exist user email",
    description:
      "파라미터로 받은 사용자의 이메일이 데이터베이스에 존재하지 않는지 검증합니다.",
  })
  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/email/:email")
  async isNotExistUserEmail(
    @Param("email") email: string,
  ): Promise<VerifyDataInterface> {
    await this.userVerifyService.isNotExistUserEmail(email);

    return {
      message:
        "해당 이메일이 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.verify.is_not_exist.email_executed,
    };
  }

  @ApiOperation({
    summary: "is exist user realname",
    description:
      "파라미터로 받은 사용자의 실명이 데이터베이스에 존재하는지 검증합니다.",
  })
  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/realname/:realname")
  async isExistUserRealName(
    @Param("realname") realname: string,
  ): Promise<VerifyDataInterface> {
    await this.userVerifyService.isExistUserRealName(realname);

    return {
      message: "해당 실명이 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.verify.is_exist.realname_executed,
    };
  }

  @ApiOperation({
    summary: "is not exist user nickname",
    description:
      "파라미터로 받은 사용자의 별명이 데이터베이스에 존재하지 않는지 검증합니다.",
  })
  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/nickname/:nickname")
  async isNotExistUserNickName(
    @Param("nickname") nickname: string,
  ): Promise<VerifyDataInterface> {
    await this.userVerifyService.isNotExistUserNickName(nickname);

    return {
      message:
        "해당 닉네임이 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.verify.is_not_exist.nickname_executed,
    };
  }

  @ApiOperation({
    summary: "is exist user phonenumber",
    description:
      "파라미터로 받은 사용자의 전화번호가 데이터베이스에 존재하는지 검증합니다.",
  })
  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/existent/phonenumber/:phonenumber")
  async isExistUserPhoneNumber(
    @Param("phonenumber") phonenumber: string,
  ): Promise<VerifyDataInterface> {
    await this.userVerifyService.isExistUserPhoneNumber(phonenumber);

    return {
      message: "해당 전화번호가 데이터베이스에 존재하는 것이 확인되었습니다.",
      setCookieKey: this.verify.is_exist.phonenumber_executed,
    };
  }

  @ApiOperation({
    summary: "is not exist user phonenumber",
    description:
      "파라미터로 받은 사용자의 전화번호가 데이터베이스에 존재하지 않는지 검증합니다.",
  })
  @UseInterceptors(SendVerifyCookieInterceptor)
  @Get("/none-existent/phonenumber/:phonenumber")
  async isNotExistUserPhoneNumber(
    @Param("phonenumber") phonenumber: string,
  ): Promise<VerifyDataInterface> {
    await this.userVerifyService.isNotExistUserPhoneNumber(phonenumber);

    return {
      message:
        "해당 전화번호가 데이터베이스에 존재하지 않는 것이 확인되었습니다.",
      setCookieKey: this.verify.is_not_exist.phonenumber_executed,
    };
  }
}
