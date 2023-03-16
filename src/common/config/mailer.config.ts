import { Module } from "@nestjs/common";
import { MailerModule, MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<MailerOptions> => ({
        transport: {
          host: configService.get("MAIL_HOST"),
          port: configService.get("MAIL_PORT"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MailerConfigurationModule {}
