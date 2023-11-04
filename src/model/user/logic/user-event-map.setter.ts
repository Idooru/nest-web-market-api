import { Inject, Injectable } from "@nestjs/common";
import { SendMailToClientAboutRegisterDto } from "../dtos/send-mail-to-client-about-register.dto";

@Injectable()
export class UserEventMapSetter {
  constructor(
    @Inject("UserEventMap")
    private readonly userEventMap: Map<string, any>,
  ) {}

  public setRegisterEventParam(
    sendMailToClientAboutRegisterDto: SendMailToClientAboutRegisterDto,
  ): void {
    this.userEventMap.set("register", sendMailToClientAboutRegisterDto);
  }
}
