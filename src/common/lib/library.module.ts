import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvAdaptModule } from "./env/dotenv-adapt.module";
import { MediaLoggerLibrary } from "./logger/media-logger.library";
import { SecurityLibrary } from "./security/security.library";
import { TimeLoggerLibrary } from "./logger/time-logger.library";
import { EmailSenderLibrary } from "./email/email-sender.library";
import { ValidateLibrary } from "./util/validate.library";
import { TransactionErrorHandler } from "./error-handler/transaction-error.handler";
import { CatchCallbackFactoryLibrary } from "./util/catch-callback-factory.library";
import { TypeormAdaptModule } from "./database/typeorm-adapt.module";
import { MailerAdaptModule } from "./email/mailer-adapt.module";
import { EventAdaptModule } from "./event/event-adapt.module";
import { MulterAdaptModule } from "./media/multer-adapt.module";

@Module({
  imports: [
    TypeormAdaptModule,
    MailerAdaptModule,
    DotenvAdaptModule,
    EventAdaptModule,
    MulterAdaptModule,
  ],
  providers: [
    ConfigService,
    SecurityLibrary,
    EmailSenderLibrary,
    TimeLoggerLibrary,
    MediaLoggerLibrary,
    ValidateLibrary,
    TransactionErrorHandler,
    CatchCallbackFactoryLibrary,
  ],
  exports: [
    SecurityLibrary,
    EmailSenderLibrary,
    TimeLoggerLibrary,
    MediaLoggerLibrary,
    ValidateLibrary,
    TransactionErrorHandler,
    CatchCallbackFactoryLibrary,
  ],
})
export class LibraryModule {}
