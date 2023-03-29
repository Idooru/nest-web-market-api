import { Logger, UnsupportedMediaTypeException } from "@nestjs/common";

import * as fs from "fs";
import * as path from "path";
import * as multer from "multer";

export class MulterConfig {
  static createFolder(folder1: string, folder2: string) {
    const logger = new Logger("Multer");

    try {
      logger.log("Create uploads folder");
      fs.mkdirSync(path.join(__dirname, "../../../uploads"));
    } catch (err) {
      logger.log("uploads folder is already exist");
    }

    try {
      logger.log(`Create ${folder1} ${folder2} folder into uploads folder`);
      fs.mkdirSync(path.join(__dirname, `../../../uploads/${folder1}`));
      fs.mkdirSync(path.join(__dirname, `../../../uploads/${folder2}`));

      ["review", "inquiry", "announcement"].forEach((idx) => {
        fs.mkdirSync(
          path.join(__dirname, `../../../uploads/${folder1}/${idx}`),
        );
        fs.mkdirSync(
          path.join(__dirname, `../../../uploads/${folder2}/${idx}`),
        );
      });

      fs.mkdirSync(path.join(__dirname, `../../../uploads/${folder1}/product`));
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
      logger.log(`${folder1} is already exist`);
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

  static upload = (folder: string) => ({
    storage: this.storage(folder),
  });
}

export const maxContentsCount = 5;
