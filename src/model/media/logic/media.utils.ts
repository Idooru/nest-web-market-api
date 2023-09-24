import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MediaCookieDto } from "../dto/media-cookie.dto";

@Injectable()
export class MediaUtils {
  constructor(private readonly configService: ConfigService) {}

  public setUrl(mediaFileName: string, path: string): string {
    return `${this.configService.get(
      "APPLICATION_SCHEME",
    )}://${this.configService.get("APPLICATION_HOST")}:${this.configService.get(
      "APPLICATION_PORT",
    )}/media/${path}/${mediaFileName}`.toLowerCase();
  }

  public createMediaCookieValues(
    ids: string[],
    files: Express.Multer.File[],
    urls: string[],
    whatCookie: string,
  ): MediaCookieDto[] {
    return files.map((file, idx) => ({
      id: ids[idx],
      whatCookie,
      url: urls[idx],
      fileName: file.filename,
    }));
  }

  public createStuffs(
    files: Express.Multer.File[],
    path: string,
  ): {
    url: string;
    size: number;
  }[] {
    return files.map(
      (file: Express.Multer.File): { size: number; url: string } => {
        const url = this.setUrl(file.filename, path);
        const size = file.size;

        return { url, size };
      },
    );
  }

  public getMediaCookies(
    ids: string[],
    files: Express.Multer.File[],
    path: string,
    whatCookie: string,
  ) {
    const urls = files.map((file) => this.setUrl(file.filename, path));

    return this.createMediaCookieValues(ids, files, urls, whatCookie);
  }
}
