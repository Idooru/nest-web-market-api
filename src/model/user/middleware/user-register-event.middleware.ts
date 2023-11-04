import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { SendMailToClientAboutRegisterDto } from "../dtos/send-mail-to-client-about-register.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { eventConfigs } from "../../../common/config/event-configs";

@Injectable()
export class UserRegisterEventMiddleware implements NestMiddleware {
  constructor(
    @Inject("UserEventMap")
    private readonly userEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const sendMailToClientAboutRegisterDto: SendMailToClientAboutRegisterDto =
        this.userEventMap.get("register");

      if (!sendMailToClientAboutRegisterDto) return;

      this.eventEmitter.emit(
        eventConfigs.sendMailRegister,
        sendMailToClientAboutRegisterDto,
      );
    });

    next();
  }
}
