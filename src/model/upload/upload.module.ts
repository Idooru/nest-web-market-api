import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UploadService } from "../upload/services/upload.service";
import { UploadController } from "../upload/controllers/upload.controller";
import { ImagesEntity, VideosEntity } from "./entities/upload.entity";
import { UploadRepository } from "./upload.repository";
import { MulterConfig } from "src/common/config/multer.config";

@Module({
  imports: [TypeOrmModule.forFeature([ImagesEntity, VideosEntity])],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository, MulterConfig],
  exports: [UploadRepository],
})
export class UploadModule {}
