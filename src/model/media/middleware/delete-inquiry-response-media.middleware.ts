import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NextFunction, Request, Response } from "express";
import { DeleteMediaFilesDto } from "../dto/delete-media-files.dto";
import { eventConfigs } from "../../../common/config/event-configs";

@Injectable()
export class DeleteInquiryResponseMediaMiddleware implements NestMiddleware {
  constructor(
    @Inject("DeleteMediaEventMap")
    private readonly mediaEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const deleteMediaFilesDto: DeleteMediaFilesDto = this.mediaEventMap.get(
        "delete-inquiry-response-medias",
      );

      this.mediaEventMap.clear();

      if (!deleteMediaFilesDto) return;

      this.eventEmitter.emit(eventConfigs.deleteMediaFile, deleteMediaFilesDto);
    });

    next();
  }
}
