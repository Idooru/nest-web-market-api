import { Injectable } from "@nestjs/common";
import { eventConfigs } from "../../../common/config/event-configs";
import { OnEvent } from "@nestjs/event-emitter";
import { DeleteMediaFilesDto } from "../dto/delete-media-files.dto";
import { promises as fs } from "fs";
import path from "path";

@Injectable()
export class MediaFileEraser {
  @OnEvent(eventConfigs.deleteMediaFile, { async: true })
  public async deleteMediaFile(deleteMediaFilesDto: DeleteMediaFilesDto): Promise<void> {
    deleteMediaFilesDto.imageFiles.fileName.forEach((image) => {
      const prefix = deleteMediaFilesDto.imageFiles.imagePrefix;
      const mediaFilePrefix = prefix.concat("/").concat(image);
      const mediaFileUrl = path.join(__dirname, "../../../../uploads", mediaFilePrefix);
      fs.unlink(mediaFileUrl);
    });
    deleteMediaFilesDto.videoFiles.fileName.forEach((video) => {
      const prefix = deleteMediaFilesDto.videoFiles.videoPrefix;
      const mediaFilePrefix = prefix.concat("/").concat(video);
      const mediaFileUrl = path.join(__dirname, "../../../../uploads", mediaFilePrefix);
      fs.unlink(mediaFileUrl);
    });
  }
}
