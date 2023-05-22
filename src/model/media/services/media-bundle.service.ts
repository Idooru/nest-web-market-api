import { Injectable } from "@nestjs/common";
import { MediaAccessoryService } from "./media-accessory.service";
import { MediaDto } from "../dto/media.dto";
import { IMediaBundleService } from "../interfaces/services/media-bundle-service.interface";

@Injectable()
export class MediaBundleService implements IMediaBundleService {
  constructor(private readonly mediaAccessoryService: MediaAccessoryService) {}

  deleteMediaFile(mediaCookies: MediaDto[], mediaPath: string): void {
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
