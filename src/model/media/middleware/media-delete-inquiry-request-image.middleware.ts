import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DeleteMediaFilesDto } from "../dto/delete-media-files.dto";
import { eventConfigs } from "../../../common/config/event-configs";

@Injectable()
export class MediaDeleteInquiryRequestImageMiddleware
  implements NestMiddleware
{
  constructor(
    @Inject("MediaEventMap")
    private readonly mediaEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const deleteInquiryRequestImageFilesDto: DeleteMediaFilesDto =
        this.mediaEventMap.get("delete-inquiry-request-images");

      this.mediaEventMap.clear();

      if (!deleteInquiryRequestImageFilesDto) return;

      this.eventEmitter.emit(
        eventConfigs.deleteMediaFile,
        deleteInquiryRequestImageFilesDto,
      );
    });

    next();
  }
}
