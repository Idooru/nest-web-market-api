import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { DeleteMediaFilesDto } from "../dto/delete-media-files.dto";
import { eventConfigs } from "../../../common/config/event-configs";

@Injectable()
export class MediaDeleteInquiryResponseImageMiddleware
  implements NestMiddleware
{
  constructor(
    @Inject("MediaEventMap")
    private readonly mediaEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const deleteInquiryResponseImageFilesDto: DeleteMediaFilesDto =
        this.mediaEventMap.get("delete-inquiry-response-images");

      this.mediaEventMap.clear();

      if (!deleteInquiryResponseImageFilesDto) return;

      this.eventEmitter.emit(
        eventConfigs.deleteMediaFile,
        deleteInquiryResponseImageFilesDto,
      );
    });

    next();
  }
}
