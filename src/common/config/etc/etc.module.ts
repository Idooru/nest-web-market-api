import { Module } from "@nestjs/common";
import { Promises } from "../etc/providers/functions";

@Module({
  providers: [Promises],
  exports: [Promises],
})
export class EtcModule {}
