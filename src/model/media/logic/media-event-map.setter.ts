import { Inject, Injectable } from "@nestjs/common";
import { DeleteMediaFilesDto } from "../dto/request/delete-media-files.dto";

@Injectable()
export class MediaEventMapSetter {
  constructor(
    @Inject("delete-media-event-map")
    private readonly mediaEventMap: Map<string, any>,
  ) {}

  public setDeleteMediaFilesEventParam(event: string, dto: DeleteMediaFilesDto): void {
    this.mediaEventMap.set(event, dto);
  }
}
