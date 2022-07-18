import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { UploadService } from "./providers/upload.service";
import { UploadController } from "../upload/controllers/upload.controller";
import { ProductsImageEntity } from "./entities/product.image.entity";
import { ReviewsImageEntity } from "./entities/review.image.entity";
import { ReviewsVideoEntity } from "./entities/review.video.entity";
import { UploadRepository } from "./providers/upload.repository";
import { NestjsFormDataModule } from "nestjs-form-data";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsImageEntity,
      ReviewsImageEntity,
      ReviewsVideoEntity,
    ]),
    forwardRef(() => UserModule),
    NestjsFormDataModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
  exports: [UploadService, UploadRepository],
})
export class UploadModule {}
