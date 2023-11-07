import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Request, Response, NextFunction } from "express";
import { DeleteMediaFilesDto } from "../dto/delete-media-files.dto";
import { eventConfigs } from "../../../common/config/event-configs";

@Injectable()
export class MediaDeleteReviewVideoMiddleware implements NestMiddleware {
  constructor(
    @Inject("MediaEventMap")
    private readonly mediaEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const deleteReviewVideoFilesDto: DeleteMediaFilesDto =
        this.mediaEventMap.get("delete-review-videos");

      this.mediaEventMap.clear();

      if (!deleteReviewVideoFilesDto) return;

      this.eventEmitter.emit(
        eventConfigs.deleteMediaFile,
        deleteReviewVideoFilesDto,
      );
    });

    next();
  }
}
