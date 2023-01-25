import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { config } from "dotenv";
config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV === "dev" ? ".dev" : ".test"}`,
    }),
  ],
})
export class DotenvConfigurationModule {}
