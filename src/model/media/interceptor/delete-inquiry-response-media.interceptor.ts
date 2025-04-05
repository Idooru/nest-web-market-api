import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable, tap } from "rxjs";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { eventConfigs } from "../../../common/config/event-configs";
import { DeleteMediaFilesDto } from "../dto/request/delete-media-files.dto";

@Injectable()
export class DeleteInquiryResponseMediaInterceptor implements NestInterceptor {
  constructor(
    @Inject("delete-media-event-map")
    private readonly deleteMediaEventMap: Map<string, any>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Implemented
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse<Response>();

    const deleteInquiryResponseMedia = () => {
      const dto: DeleteMediaFilesDto = this.deleteMediaEventMap.get("delete-inquiry-response-medias");
      this.deleteMediaEventMap.clear();
      if (!dto) return;
      this.eventEmitter.emit(eventConfigs.deleteMediaFile, dto);
    };

    return next.handle().pipe(tap(() => res.on("finish", deleteInquiryResponseMedia)));
  }
}
