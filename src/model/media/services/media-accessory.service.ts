import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ResponseMediaDto } from "../dto/response-media.dto";
import * as fs from "fs";
import * as path from "path";

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
  ): ResponseMediaDto {
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
  ): ResponseMediaDto[] {
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
