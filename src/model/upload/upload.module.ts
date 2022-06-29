import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { UploadService } from "../upload/services/upload.service";
import { UploadController } from "../upload/controllers/upload.controller";
import { ImagesEntity, VideosEntity } from "./entities/upload.entity";
import { UploadRepository } from "./upload.repository";
import { MulterConfig } from "src/common/config/multer.config";
import { NestjsFormDataModule } from "nestjs-form-data";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ImagesEntity, VideosEntity]),
    forwardRef(() => UserModule),
    NestjsFormDataModule,
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    UploadRepository,
    MulterConfig,
    ImagesEntity,
    VideosEntity,
  ],
  exports: [
    UploadService,
    UploadRepository,
    ImagesEntity,
    VideosEntity,
    MulterConfig,
  ],
})
export class UploadModule {}
