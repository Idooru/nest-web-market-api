import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Request, Response, NextFunction } from "express";
import { SendMailToAdminAboutInquiryRequestDto } from "../dto/request/send-mail-to-admin-about-inquiry-request.dto";
import { eventConfigs } from "../../../common/config/event-configs";

@Injectable()
export class InquiryClientEventMiddleware implements NestMiddleware {
  constructor(
    @Inject("MailEventMap")
    private readonly mailEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const sendMailToAdminAboutInquiryRequestDto: SendMailToAdminAboutInquiryRequestDto =
        this.mailEventMap.get("client");

      this.mailEventMap.clear();

      if (!sendMailToAdminAboutInquiryRequestDto) return;

      this.eventEmitter.emit(
        eventConfigs.sendMailInquiryRequest,
        sendMailToAdminAboutInquiryRequestDto,
      );
    });

    next();
  }
}
