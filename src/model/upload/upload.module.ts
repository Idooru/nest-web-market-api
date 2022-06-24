import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UploadService } from "../upload/services/upload.service";
import { UploadController } from "../upload/controllers/upload.controller";
import { ImagesEntity, VideosEntity } from "./entities/upload.entity";
import { UploadRepository } from "./upload.repository";
import { MulterConfig } from "src/common/config/multer.config";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  imports: [
    TypeOrmModule.forFeature([ImagesEntity, VideosEntity]),
    NestjsFormDataModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository, MulterConfig],
  exports: [UploadRepository],
})
export class UploadModule {}
