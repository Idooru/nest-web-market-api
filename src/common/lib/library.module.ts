import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { MeidaLoggerLibrary } from "./logger/media-logger.library";
import { SecurityLibrary } from "./config/security.library";
import { TimeLoggerLibrary } from "./logger/time-logger.library";
import { RepositoryLayerErrorHandleLibrary } from "./error-handler/repository-error-handler.library";
import { ServiceLayerErrorHandlerLibrary } from "./error-handler/service-layer-error-handler.library";
import { SendEmailLibrary } from "./email/send-email-library";
import { MailerConfigurationModule } from "../config/mailer.config";

@Module({
  imports: [DotenvConfigurationModule, MailerConfigurationModule],
  providers: [
    TimeLoggerLibrary,
    ConfigService,
    SecurityLibrary,
    MeidaLoggerLibrary,
    RepositoryLayerErrorHandleLibrary,
    ServiceLayerErrorHandlerLibrary,
    SendEmailLibrary,
  ],
  exports: [
    TimeLoggerLibrary,
    SecurityLibrary,
    MeidaLoggerLibrary,
    RepositoryLayerErrorHandleLibrary,
    ServiceLayerErrorHandlerLibrary,
    SendEmailLibrary,
  ],
})
export class LibraryModule {}
