import { Inject, Injectable } from "@nestjs/common";
import { SendMailToClientAboutRegisterDto } from "../dto/response/send-mail-to-client-about-register.dto";

@Injectable()
export class UserEventMapSetter {
  constructor(
    @Inject("mail-event-map")
    private readonly mailEventMap: Map<string, any>,
  ) {}

  public setRegisterEventParam(dto: SendMailToClientAboutRegisterDto): void {
    this.mailEventMap.set("register", dto);
  }
}
