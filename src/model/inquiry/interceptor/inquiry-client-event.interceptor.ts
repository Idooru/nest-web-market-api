import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable, tap } from "rxjs";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { eventConfigs } from "../../../common/config/event-configs";
import { SendMailToAdminAboutInquiryRequestDto } from "../dto/inquiry-request/response/send-mail-to-admin-about-inquiry-request.dto";

@Injectable()
export class InquiryClientEventInterceptor implements NestInterceptor {
  constructor(
    @Inject("mail-event-map")
    private readonly mailEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Implemented
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse<Response>();

    const sendMailToAdminAboutInquiryRequest = () => {
      const dto: SendMailToAdminAboutInquiryRequestDto = this.mailEventMap.get("inquiry-request");
      this.mailEventMap.clear();
      if (!dto) return;
      this.eventEmitter.emit(eventConfigs.sendMailInquiryRequest, dto);
    };

    return next.handle().pipe(tap(() => res.on("finish", sendMailToAdminAboutInquiryRequest)));
  }
}
