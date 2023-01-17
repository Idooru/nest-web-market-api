import { Module } from "@nestjs/common";
import { LibarayModule } from "../lib/library.module";

@Module({
  imports: [LibarayModule],
})
export class InterceptorModule {}
//
