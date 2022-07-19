import { forwardRef, Module } from "@nestjs/common";
import { Promises } from "./providers/promises";
import { ReviewModule } from "src/model/review/review.module";
import { Bundle } from "./providers/bundle";

@Module({
  imports: [forwardRef(() => ReviewModule)],
  providers: [Promises, Bundle],
  exports: [Promises, Bundle],
})
export class FunctionModule {}
