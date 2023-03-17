import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as fs from "fs";
import * as path from "path";

@Injectable()
export class MediaRedundantService {
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
    return `http://${this.configService.get(
      "APPLICATION_HOST",
    )}:${this.configService.get(
      "APPLICATION_PORT",
    )}/media/${mediaFileName}`.toLowerCase();
  }

  deleteMediaFilesOnServerDisk(mediaFileName: string, mediaPath: string) {
    fs.rmSync(
      path.join(__dirname, `../../../../uploads/${mediaPath}/${mediaFileName}`),
    );
  }
}
