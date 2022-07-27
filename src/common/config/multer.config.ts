import { Logger, UnsupportedMediaTypeException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

import * as fs from "fs";
import * as path from "path";
import * as multer from "multer";

export class MulterConfig {
  static createFolder(folder1: string, folder2: string) {
    const logger = new Logger("Multer");

    try {
      logger.log("create uploads folder");
      fs.mkdirSync(path.join(__dirname, "../../../../uploads"));
    } catch (err) {
      logger.log("uploads folder is already exist");
    }

    try {
      logger.log(`create ${folder1} folder into uploads foler`);
      fs.mkdirSync(path.join(__dirname, `../../../../uploads/${folder1}`));
    } catch (err) {
      logger.log(`${folder1} is already exist`);
    }

    try {
      logger.log(`create ${folder2} folder into uploads folder`);
      fs.mkdirSync(path.join(__dirname, `../../../../uploads/${folder2}`));
    } catch (err) {
      logger.log(`${folder2} is already exist`);
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
        const folderName = path.join(
          __dirname,
          `../../../../uploads/${folder}`,
        );

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

  static upload(folder: string) {
    const result: MulterOptions = {
      storage: this.storage(folder),
    };
    return result;
  }
}
