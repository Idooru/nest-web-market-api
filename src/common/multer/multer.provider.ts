import { Injectable, Logger } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

import * as fs from "fs";
import * as path from "path";
import * as multer from "multer";

@Injectable()
export class MulterProvider {
  private readonly logger = new Logger("Multer");

  createFolder(folder: string) {
    try {
      this.logger.log("create uploads folder");
      fs.mkdirSync(path.join(__dirname, "../../../uploads"));
    } catch (err) {
      this.logger.log("uploads folder is already exist");
    }

    try {
      this.logger.log(`create ${folder} folder into uploads foler`);
      fs.mkdirSync(path.join(__dirname, `../../../uploads/${folder}`));
    } catch (err) {
      this.logger.log(`${folder} is already exist`);
    }
  }

  storage(folder: string): multer.StorageEngine {
    this.createFolder(folder);

    return multer.diskStorage({
      destination(req, file, cb) {
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

  apply(folder: string) {
    const result: MulterOptions = {
      storage: this.storage(folder),
    };
    return result;
  }
}
