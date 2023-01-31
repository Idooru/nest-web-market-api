import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MeidaLoggerLibrary {
  private readonly logger = new Logger("Media");

  public log(mediaType: string, file: Express.Multer.File): void {
    delete file.destination;
    delete file.path;
    this.logger.log(`logging ${mediaType} info ↓\n${JSON.stringify(file)}`);
  }
}
