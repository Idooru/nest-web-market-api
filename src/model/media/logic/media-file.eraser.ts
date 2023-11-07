import { Injectable } from "@nestjs/common";
import { eventConfigs } from "../../../common/config/event-configs";
import { OnEvent } from "@nestjs/event-emitter";
import { DeleteMediaFilesDto } from "../dto/delete-media-files.dto";
import { promises as fs } from "fs";
import path from "path";

@Injectable()
export class MediaFileEraser {
  @OnEvent(eventConfigs.deleteMediaFile, { async: true })
  async deleteMediaFile(deleteMediaFilesDto: DeleteMediaFilesDto) {
    deleteMediaFilesDto.mediaCookiesDto.forEach((mediaFile) => {
      const { fileName } = mediaFile;
      const { prefix } = deleteMediaFilesDto;
      const mediaFilePrefix = prefix.concat("/").concat(fileName);
      const mediaFileUrl = path.join(
        __dirname,
        "../../../../uploads",
        mediaFilePrefix,
      );
      fs.unlink(mediaFileUrl);
    });
  }
}
