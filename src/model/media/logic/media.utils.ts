import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MediaEventMapSetter } from "./media-event-map.setter";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";
import { UploadMediaDto } from "../dto/request/upload-media.dto";
import { SetDeleteMediaFilesDto } from "../dto/response/set-delete-media-files.dto";
import { DeleteMediaFilesDto } from "../dto/request/delete-media-files.dto";

@Injectable()
export class MediaUtils {
  constructor(
    private readonly configService: ConfigService,
    private readonly mediaEventMapSetter: MediaEventMapSetter,
  ) {}

  public setUrl(mediaFileName: string, path: string): string {
    return `${this.configService.get("APPLICATION_SCHEME")}://${this.configService.get(
      "APPLICATION_HOST",
    )}:${this.configService.get("APPLICATION_PORT")}/media/${path}/${mediaFileName}`.toLowerCase();
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

  public createStuffs(files: Express.Multer.File[], path: string): UploadMediaDto[] {
    return files.map((file: Express.Multer.File) => {
      const url = this.setUrl(file.filename, path);
      const size = file.size;

      return { url, size };
    });
  }

  public getMediaCookies(ids: string[], files: Express.Multer.File[], path: string, whatCookie: string) {
    const urls = files.map((file) => this.setUrl(file.filename, path));

    return this.createMediaCookieValues(ids, files, urls, whatCookie);
  }

  public deleteMediaFiles<I extends { url: string }, V extends { url: string }>(
    dto: SetDeleteMediaFilesDto<I, V>,
  ): void {
    const { images, videos, mediaEntity, option, callWhere } = dto;

    let imagePattern: RegExp;
    let videoPattern: RegExp;
    let imagePrefix: string;
    let videoPrefix: string;
    let event: string;

    if (option) {
      imagePattern = new RegExp(`/${mediaEntity}/${option}/images/([^/]+)`);
      videoPattern = new RegExp(`/${mediaEntity}/${option}/videos/([^/]+)`);
      imagePrefix = `images/${mediaEntity}/${option}`;
      videoPrefix = `videos/${mediaEntity}/${option}`;
      event = `delete-${mediaEntity}-${option}-medias`;
    } else {
      imagePattern = new RegExp(`/${mediaEntity}/images/([^/]+)`);
      videoPattern = new RegExp(`/${mediaEntity}/videos/([^/]+)`);
      imagePrefix = `images/${mediaEntity}`;
      videoPrefix = `videos/${mediaEntity}`;
      event = `delete-${mediaEntity}-medias`;
    }

    let imageFileNames: string[];
    let videoFileNames: string[];

    if (callWhere === "cancel upload") {
      imageFileNames = images ? images.map((image) => image.url) : [];
      videoFileNames = videos ? videos.map((video) => video.url) : [];
    } else {
      imageFileNames = images ? images.map((image) => image.url.match(imagePattern)[1]) : [];
      videoFileNames = videos ? videos.map((video) => video.url.match(videoPattern)[1]) : [];
    }

    const mediaFiles: DeleteMediaFilesDto = {
      imageFiles: {
        fileName: imageFileNames,
        imagePrefix,
      },
      videoFiles: {
        fileName: videoFileNames,
        videoPrefix,
      },
    };

    this.mediaEventMapSetter.setDeleteMediaFilesEventParam(event, mediaFiles);
  }
}
