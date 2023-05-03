import { Logger, Module, UnsupportedMediaTypeException } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { promises as fsPromises } from "fs";
import * as path from "path";
import * as multer from "multer";

export class MulterConfigService {
  public createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    this.createFolder();
    return { storage: MulterConfigService.storage, dest: "../../../uploads" };
  }

  static maxContentsCount = 5;
  private readonly logger = new Logger("MulterConfiguration");
  private readonly inquiry = ["request", "response"];

  private async createUploadFolder() {
    try {
      this.logger.log("Create uploads folder");
      await fsPromises.mkdir(path.join(__dirname, "../../../uploads"));
    } catch (err) {
      this.logger.log("uploads folder is already exist");
    }
  }

  private async createImageFolder() {
    const stuffForImages = ["product", "review", "inquiry", "announcement"];

    this.logger.log("Create folders about image into uploads folder");
    try {
      await fsPromises.mkdir(path.join(__dirname, "../../../uploads/image"));

      const modelPromises = stuffForImages.map(async (model) => {
        return await fsPromises.mkdir(
          path.join(__dirname, `../../../uploads/image/${model}`),
        );
      });

      const inquiryPromises = this.inquiry.map(async (val) => {
        return await fsPromises.mkdir(
          path.join(__dirname, `../../../uploads/image/inquiry/${val}`),
        );
      });

      const promises = [...modelPromises, ...inquiryPromises];
      await Promise.all(promises);
    } catch (err) {
      this.logger.log("image is already exist");
    }
  }

  private async createVideoFolder() {
    const stuffForVideos = ["review", "inquiry", "announcement"];

    this.logger.log("Create folders about video into uploads folder");
    try {
      await fsPromises.mkdir(path.join(__dirname, "../../../uploads/video"));

      const modelPromises = stuffForVideos.map(async (model) => {
        return await fsPromises.mkdir(
          path.join(__dirname, `../../../uploads/video/${model}`),
        );
      });

      const inquiryPromises = this.inquiry.map(async (val) => {
        return await fsPromises.mkdir(
          path.join(__dirname, `../../../uploads/video/inquiry/${val}`),
        );
      });

      const promises = [...modelPromises, ...inquiryPromises];
      await Promise.all(promises);
    } catch (err) {
      this.logger.log("video is already exist`");
    }
  }

  private createFolder(): void {
    this.createUploadFolder();
    this.createImageFolder();
    this.createVideoFolder();
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
