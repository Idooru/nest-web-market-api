import { loggerFactory } from "src/common/functions/logger.factory";

export class MediaLoggerLibrary {
  private readonly logger = loggerFactory("Media");

  public log(mediaType: string, files: Express.Multer.File[]): void {
    files.forEach((file) => {
      delete file.destination;
      delete file.path;
    });
    this.logger.log(`logging ${mediaType} info ↓\n${JSON.stringify(files)}`);
  }
}
