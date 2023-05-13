import { loggerFactory } from "src/common/functions/logger.factory";

export class MeidaLoggerLibrary {
  private readonly logger = loggerFactory("Media");

  public log(
    mediaType: string,
    file?: Express.Multer.File,
    files?: Express.Multer.File[],
  ): void {
    if (file) {
      delete file.destination;
      delete file.path;
      this.logger.log(`logging ${mediaType} info ↓\n${JSON.stringify(file)}`);
    }

    if (files) {
      files.forEach((file) => {
        delete file.destination;
        delete file.path;
      });
      this.logger.log(`logging ${mediaType} info ↓\n${JSON.stringify(files)}`);
    }
  }
}
