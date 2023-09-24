import { Injectable } from "@nestjs/common";
import { MediaAccessoryService } from "./media-accessory.service";
import { MediaCookieDto } from "../dto/media-cookie.dto";
import { IMediaBundleService } from "../interfaces/services/media-bundle-service.interface";

@Injectable()
export class MediaBundleService implements IMediaBundleService {
  constructor(private readonly mediaAccessoryService: MediaAccessoryService) {}

  deleteMediaFile(mediaCookies: MediaCookieDto[], mediaPath: string): void {
    mediaCookies.forEach((cookie) => {
      this.mediaAccessoryService.deleteMediaFilesOnServerDisk(
        cookie.fileName,
        mediaPath,
      );
    });
  }
}
