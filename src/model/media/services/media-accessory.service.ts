import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import { MediaDto } from "../dto/media.dto";

@Injectable()
export class MediaAccessoryService {
  constructor(private readonly configService: ConfigService) {}

  isExistMediaFile(
    mediaType: string,
    file: Express.Multer.File | Express.Multer.File[],
  ) {
    if (!file) {
      throw new BadRequestException(
        `${mediaType}을(를) 업로드 할 수 없습니다. 파일을 제시해주세요.`,
      );
    }
  }

  setUrl(mediaFileName: string): string {
    return `${this.configService.get(
      "APPLICATION_SCHEME",
    )}://${this.configService.get("APPLICATION_HOST")}:${this.configService.get(
      "APPLICATION_PORT",
    )}/media/${mediaFileName}`.toLowerCase();
  }

  createMediaCookieValue(
    cookieKey: string,
    file: Express.Multer.File,
  ): MediaDto {
    return {
      whatCookie: cookieKey,
      url: this.setUrl(file.filename),
      fileName: file.filename,
    };
  }

  createMediaCookieValues(
    cookieKey: string,
    files: Express.Multer.File[],
    urls: string[],
  ): MediaDto[] {
    return files.map((file, idx) => ({
      whatCookie: cookieKey,
      url: urls[idx],
      fileName: file.filename,
    }));
  }

  deleteMediaFilesOnServerDisk(mediaFileName: string, mediaPath: string) {
    fs.rmSync(
      path.join(__dirname, `../../../../uploads/${mediaPath}/${mediaFileName}`),
    );
  }
}
