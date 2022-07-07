import { Module } from "@nestjs/common";
import { Promises } from "./providers/promises";

@Module({
  providers: [Promises],
  exports: [Promises],
})
export class EtcModule {}
