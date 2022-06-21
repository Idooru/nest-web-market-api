import { MulterProvider } from "src/model/upload/multer.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UploadService } from "../upload/services/upload.service";
import { UploadController } from "../upload/controllers/upload.controller";
import { ImagesEntity, VideosEntity } from "./entities/upload.entity";
import { UploadRepository } from "./upload.repository";

@Module({
  imports: [TypeOrmModule.forFeature([ImagesEntity, VideosEntity])],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository, MulterProvider],
  exports: [UploadRepository],
})
export class UploadModule {}
