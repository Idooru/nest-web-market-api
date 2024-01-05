import { forwardRef, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvAdaptModule } from "./env/dotenv-adapt.module";
import { MediaLoggerLibrary } from "./logger/media-logger.library";
import { SecurityLibrary } from "./security/security.library";
import { TimeLoggerLibrary } from "./logger/time-logger.library";
import { EmailSenderLibrary } from "./email/email-sender.library";
import { ValidateLibrary } from "./util/validate.library";
import { CatchCallbackFactoryLibrary } from "./util/catch-callback-factory.library";
import { TypeormAdaptModule } from "./database/typeorm-adapt.module";
import { MailerAdaptModule } from "./email/mailer-adapt.module";
import { EventAdaptModule } from "./event/event-adapt.module";
import { MulterAdaptModule } from "./media/multer-adapt.module";
import { ValidateTokenLibrary } from "./security/validate-token.library";
import { AuthModule } from "../../model/auth/auth.module";
import { JwtErrorHandlerLibrary } from "./jwt/jwt-error-handler.library";
import { TransactionHandler } from "./handler/transaction.handler";

@Module({
  imports: [
    TypeormAdaptModule,
    MailerAdaptModule,
    DotenvAdaptModule,
    EventAdaptModule,
    MulterAdaptModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    ConfigService,
    SecurityLibrary,
    EmailSenderLibrary,
    TimeLoggerLibrary,
    MediaLoggerLibrary,
    ValidateLibrary,
    TransactionHandler,
    CatchCallbackFactoryLibrary,
    ValidateTokenLibrary,
    JwtErrorHandlerLibrary,
  ],
  exports: [
    SecurityLibrary,
    EmailSenderLibrary,
    TimeLoggerLibrary,
    MediaLoggerLibrary,
    ValidateLibrary,
    TransactionHandler,
    CatchCallbackFactoryLibrary,
    ValidateTokenLibrary,
    JwtErrorHandlerLibrary,
  ],
})
export class LibraryModule {}
