import {
  Injectable,
  Logger,
  Module,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as fs from "fs";
import * as path from "path";
import * as multer from "multer";

@Injectable()
export class MulterConfigService {
  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    MulterConfigService.createFolder();
    return { storage: MulterConfigService.storage };
  }

  static maxContentsCount = 5;

  static createFolder(): void {
    const logger = new Logger("MulterConfiguration");

    try {
      logger.log("Create uploads folder");
      fs.mkdirSync(path.join(__dirname, "../../../uploads"));
    } catch (err) {
      logger.log("uploads folder is already exist");
    }

    try {
      logger.log(`Create image and video folder into uploads folder`);
      fs.mkdirSync(path.join(__dirname, `../../../uploads/image`));
      fs.mkdirSync(path.join(__dirname, `../../../uploads/video`));

      ["review", "inquiry", "announcement"].forEach((idx) => {
        fs.mkdirSync(path.join(__dirname, `../../../uploads/image/${idx}`));
        fs.mkdirSync(path.join(__dirname, `../../../uploads/video/${idx}`));
      });

      fs.mkdirSync(path.join(__dirname, `../../../uploads/image/product`));
      fs.mkdirSync(
        path.join(__dirname, "../../../uploads/image/inquiry/request"),
      );
      fs.mkdirSync(
        path.join(__dirname, "../../../uploads/image/inquiry/response"),
      );
      fs.mkdirSync(
        path.join(__dirname, "../../../uploads/video/inquiry/request"),
      );
      fs.mkdirSync(
        path.join(__dirname, "../../../uploads/video/inquiry/response"),
      );
    } catch (err) {
      logger.log(`image is already exist`);
      logger.log(`video is already exist`);
    }
  }

  static storage(folder: string): multer.StorageEngine {
    return multer.diskStorage({
      destination(req, file, cb) {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|mp4|MOV|AVI)$/)) {
          cb(
            new UnsupportedMediaTypeException(
              "파일 형식이 올바르지 않아 업로드 할 수 없습니다.",
            ),
            null,
          );
        }
        const folderName = path.join(__dirname, `../../../uploads/${folder}`);

        cb(null, folderName);
      },
      filename(req, file, cb) {
        const ext: string = path.extname(file.originalname);

        const fileName = `${path.basename(
          file.originalname,
          ext,
        )}-${Date.now()}${ext}`;

        cb(null, fileName);
      },
    });
  }

  static upload(folder: string): MulterOptions {
    return { storage: this.storage(folder) };
  }
}

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
})
export class MulterConfigurationModule {}
