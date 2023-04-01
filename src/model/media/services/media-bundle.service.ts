import { Injectable } from "@nestjs/common";
import { MediaAccessoryService } from "./media-accessory.service";
import { MediaDto } from "../dto/media.dto";

@Injectable()
export class MediaBundleService {
  constructor(private readonly mediaAccessoryService: MediaAccessoryService) {}

  deleteMediaFile(mediaCookies: MediaDto[], mediaPath: string) {
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
