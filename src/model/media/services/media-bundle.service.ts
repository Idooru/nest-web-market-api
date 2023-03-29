import { Injectable } from "@nestjs/common";
import { RequestMediaDto } from "../dto/request-media.dto";
import { MediaAccessoryService } from "./media-accessory.service";

@Injectable()
export class MediaBundleService {
  constructor(private readonly mediaAccessoryService: MediaAccessoryService) {}

  deleteMediaFile(mediaCookies: RequestMediaDto[], mediaPath: string) {
    if (mediaCookies.length >= 2) {
      mediaCookies.forEach((cookie) => {
        this.mediaAccessoryService.deleteMediaFilesOnServerDisk(
          cookie.fileName,
          mediaPath,
        );
      });
    } else {
      this.mediaAccessoryService.deleteMediaFilesOnServerDisk(
        mediaCookies[0].fileName,
        mediaPath,
      );
    }
  }
}
