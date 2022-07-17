import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { UploadService } from "./providers/upload.service";
import { UploadController } from "../upload/controllers/upload.controller";
import { ImagesEntity, VideosEntity } from "./entities/upload.entity";
import { UploadRepository } from "./providers/upload.repository";
import { NestjsFormDataModule } from "nestjs-form-data";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ImagesEntity, VideosEntity]),
    forwardRef(() => UserModule),
    NestjsFormDataModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
  exports: [UploadService, UploadRepository],
})
export class UploadModule {}
