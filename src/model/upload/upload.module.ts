import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { ImagesEntity, VideosEntity } from "./entities/upload.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ImagesEntity, VideosEntity])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
