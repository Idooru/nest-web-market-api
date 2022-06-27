import { Module } from "@nestjs/common";
import { Functions } from "./providers/functions";

@Module({
  providers: [Functions],
  exports: [Functions],
})
export class EtcModule {}
