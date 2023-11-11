import { Inject, Injectable } from "@nestjs/common";
import { DeleteMediaFilesDto } from "../dto/delete-media-files.dto";

@Injectable()
export class MediaEventMapSetter {
  constructor(
    @Inject("DeleteMediaEventMap")
    private readonly deleteMediaEventMap: Map<string, any>,
  ) {}

  public setDeleteMediaFilesEventParam(
    event: string,
    deletMediaFilesDto: DeleteMediaFilesDto,
  ): void {
    this.deleteMediaEventMap.set(event, deletMediaFilesDto);
  }
}
