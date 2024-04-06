import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NextFunction, Request, Response } from "express";
import { DeleteMediaFilesDto } from "../dto/delete-media-files.dto";
import { eventConfigs } from "../../../common/config/event-configs";
import { Implemented } from "../../../common/decorators/implemented.decoration";

@Injectable()
export class DeleteInquiryRequestMediaMiddleware implements NestMiddleware {
  constructor(
    @Inject("DeleteMediaEventMap")
    private readonly mediaEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Implemented
  public use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const deleteMediaFilesDto: DeleteMediaFilesDto = this.mediaEventMap.get(
        "delete-inquiry-request-medias",
      );

      this.mediaEventMap.clear();

      if (!deleteMediaFilesDto) return;

      this.eventEmitter.emit(eventConfigs.deleteMediaFile, deleteMediaFilesDto);
    });

    next();
  }
}
