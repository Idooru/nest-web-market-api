import { Logger } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

import * as fs from "fs";
import * as path from "path";
import * as multer from "multer";

export class MulterConfig {
  private readonly logger = new Logger("Multer");

  createFolder(folder1: string, folder2: string) {
    try {
      this.logger.log("create uploads folder");
      fs.mkdirSync(path.join(__dirname, "../../../uploads"));
    } catch (err) {
      this.logger.log("uploads folder is already exist");
    }

    try {
      this.logger.log(`create ${folder1}folder into uploads foler`);
      fs.mkdirSync(path.join(__dirname, `../../../uploads/${folder1}`));
    } catch (err) {
      this.logger.log(`${folder1} is already exist`);
    }

    try {
      this.logger.log(`create ${folder2}folder into uploads folder`);
      fs.mkdirSync(path.join(__dirname, `../../../uploads/${folder2}`));
    } catch (err) {
      this.logger.log(`${folder2} is already exist`);
    }
  }

  storage(folder1: string, folder2: string): multer.StorageEngine {
    this.createFolder(folder1, folder2);

    return multer.diskStorage({
      destination(req, file, cb) {
        if (file.mimetype.includes("image")) {
          const folderName = path.join(
            __dirname,
            `../../../uploads/${folder1}`,
          );

          cb(null, folderName);
        } else {
          const folderName = path.join(
            __dirname,
            `../../../uploads/${folder2}`,
          );

          cb(null, folderName);
        }
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

  apply(folder1: string, folder2: string) {
    const result: MulterOptions = {
      storage: this.storage(folder1, folder2),
    };
    return result;
  }
}
