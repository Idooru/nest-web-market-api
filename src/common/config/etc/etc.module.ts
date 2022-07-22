import { forwardRef, Module } from "@nestjs/common";
import { Promises } from "./providers/promises";
import { ReviewModule } from "src/model/review/review.module";

@Module({
  imports: [forwardRef(() => ReviewModule)],
  providers: [Promises],
  exports: [Promises],
})
export class EtcModule {}
