import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { SendMailToClientAboutRegisterDto } from "../dtos/send-mail-to-client-about-register.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { eventConfigs } from "../../../common/config/event-configs";
import { Implemented } from "../../../common/decorators/implemented.decoration";

@Injectable()
export class UserRegisterEventMiddleware implements NestMiddleware {
  constructor(
    @Inject("MailEventMap")
    private readonly mailEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Implemented
  public use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const sendMailToClientAboutRegisterDto: SendMailToClientAboutRegisterDto = this.mailEventMap.get("register");

      this.mailEventMap.clear();

      if (!sendMailToClientAboutRegisterDto) return;

      this.eventEmitter.emit(eventConfigs.sendMailRegister, sendMailToClientAboutRegisterDto);
    });

    next();
  }
}
