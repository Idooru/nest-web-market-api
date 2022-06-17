import { Module } from "@nestjs/common";
import { MulterProvider } from "./multer.provider";

@Module({
  providers: [MulterProvider],
  exports: [MulterProvider],
})
export class MulterModule {}
