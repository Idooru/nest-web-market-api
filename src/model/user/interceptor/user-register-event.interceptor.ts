import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, NestMiddleware } from "@nestjs/common";
import { Response } from "express";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { eventConfigs } from "../../../common/config/event-configs";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { Observable, tap } from "rxjs";
import { SendMailToClientAboutRegisterDto } from "../dto/response/send-mail-to-client-about-register.dto";

@Injectable()
export class UserRegisterEventInterceptor implements NestInterceptor {
  constructor(
    @Inject("mail-event-map")
    private readonly mailEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Implemented
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse<Response>();

    const sendMailToClientAboutRegister = () => {
      const dto: SendMailToClientAboutRegisterDto = this.mailEventMap.get("register");
      this.mailEventMap.clear();
      if (!dto) return;
      this.eventEmitter.emit(eventConfigs.sendMailRegister, dto);
    };

    return next.handle().pipe(tap(() => res.on("finish", sendMailToClientAboutRegister)));
  }
}
