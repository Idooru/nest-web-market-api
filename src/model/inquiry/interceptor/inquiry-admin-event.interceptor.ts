import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable, tap } from "rxjs";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SendMailToClientAboutInquiryResponseDto } from "../dto/response/send-mail-to-client-about-inquiry-response.dto";
import { eventConfigs } from "../../../common/config/event-configs";

@Injectable()
export class InquiryAdminEventInterceptor implements NestInterceptor {
  constructor(
    @Inject("mail-event-map")
    private readonly mailEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Implemented
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse<Response>();

    const sendMailToClientAboutInquiryResponse = () => {
      const dto: SendMailToClientAboutInquiryResponseDto = this.mailEventMap.get("inquiry-response");
      this.mailEventMap.clear();
      if (!dto) return;
      this.eventEmitter.emit(eventConfigs.sendMailInquiryResponse, dto);
    };

    return next.handle().pipe(tap(() => res.on("finish", sendMailToClientAboutInquiryResponse)));
  }
}
