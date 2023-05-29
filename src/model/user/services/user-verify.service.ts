import { HttpStatus, Injectable } from "@nestjs/common";
import { UserVerifyRepository } from "../repositories/user-verify.repository";
import { IUserVerifyService } from "../interfaces/services/user-verify-service.interface";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

@Injectable()
export class UserVerifyService
  extends ErrorHandlerProps
  implements IUserVerifyService
{
  constructor(
    private readonly userVerifyRepository: UserVerifyRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  async isExistUserId(id: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistUserId(id);

    if (!result) {
      this.methodName = this.isExistUserId.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 사용자 아이디는 데이터베이스에 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }

  async isExistUserEmail(email: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistUserEmail(email);

    if (!result) {
      this.methodName = this.isExistUserEmail.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 이메일은 데이터베이스에 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }

  async isNotExistUserEmail(email: string): Promise<void> {
    const result = await this.userVerifyRepository.isNotExistUserEmail(email);

    if (!result) {
      this.methodName = this.isNotExistUserEmail.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 이메일은 데이터베이스에 존재합니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }

  async isExistUserRealName(realname: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistUserRealName(
      realname,
    );

    if (!result) {
      this.methodName = this.isExistUserRealName.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 실명은 데이터베이스에 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }

  async isNotExistUserNickName(nickname: string): Promise<void> {
    const result = await this.userVerifyRepository.isNotExistUserNickName(
      nickname,
    );

    if (!result) {
      this.methodName = this.isNotExistUserNickName.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 실명은 데이터베이스에 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }

  async isExistUserPhoneNumber(phonenumber: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistUserPhoneNumber(
      phonenumber,
    );

    if (!result) {
      this.methodName = this.isExistUserPhoneNumber.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 전화번호는 데이터베이스에 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }

  async isNotExistUserPhoneNumber(phonenumber: string): Promise<void> {
    const result = await this.userVerifyRepository.isNotExistUserPhoneNumber(
      phonenumber,
    );

    if (!result) {
      this.methodName = this.isNotExistUserPhoneNumber.name;
      this.httpExceptionHandlingBuilder
        .setMessage("해당 전화번호는 데이터베이스에 존재합니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
  }
}
