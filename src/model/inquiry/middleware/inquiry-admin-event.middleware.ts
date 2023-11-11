import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Request, Response, NextFunction } from "express";
import { SendMailToClientAboutInquiryResponseDto } from "../dto/response/send-mail-to-client-about-inquiry-response.dto";
import { eventConfigs } from "../../../common/config/event-configs";

@Injectable()
export class InquiryAdminEventMiddleware implements NestMiddleware {
  constructor(
    @Inject("MailEventMap")
    private readonly mailEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const sendMailToClientAboutInquiryResponseDto: SendMailToClientAboutInquiryResponseDto =
        this.mailEventMap.get("admin");

      this.mailEventMap.clear();

      if (!sendMailToClientAboutInquiryResponseDto) return;

      this.eventEmitter.emit(
        eventConfigs.sendMailInquiryResponse,
        sendMailToClientAboutInquiryResponseDto,
      );
    });

    next();
  }
}
