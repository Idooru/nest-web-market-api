import { ValidationError, ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ValidationExceptionFilter } from "./common/filters/validation-exception.filter";
import { ValidationException } from "./common/errors/validation.exception";
import { TypeOrmExceptionFilter } from "./common/filters/typeorm-exception.filter";
import { LibraryExceptionFilter } from "./common/filters/library-exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { loggerFactory } from "./common/functions/logger.factory";
import { EnvData } from "./common/classes/env-data";
import { envKeys } from "./common/security/env-keys";
import { staticMediaConfigs } from "./common/config/static-media-configs";
import { JwtExceptionFilter } from "./common/filters/jwt-exception.filter";

import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";

class NestCoreConfig {
  private readonly envData: EnvData = this.envDataFactory();

  constructor(private readonly app: NestExpressApplication) {
    this.setGlobals();
    this.setMiddlewares();
    this.setStaticAssets();
    this.setApiVersioning();
    this.setSwagger();
  }

  public async run() {
    await this.app.listen(this.envData.getValue("port"), "0.0.0.0", () => {
      loggerFactory("NestApplication").log(
        `Server is running at ${this.envData.getValue("scheme")}://${this.envData.getValue(
          "host",
        )}:${this.envData.getValue("port")} | NODE_ENV: ${process.env.NODE_ENV}`,
      );
    });
  }

  private envDataFactory(): EnvData {
    return new EnvData(envKeys);
  }

  private setSwagger() {
    const config = new DocumentBuilder()
      .setTitle("Nest Web Market API")
      .setDescription("Nest Web Market API 어플리케이션을 위한 API 문서입니다.")
      .setVersion("1.0")
      .addCookieAuth("connect.sid")
      .build();
    const document = SwaggerModule.createDocument(this.app, config);

    SwaggerModule.setup("api", this.app, document);
    loggerFactory("NestApplication").log("Success to setting up for swagger module");
  }

  private setGlobals() {
    this.app.useGlobalFilters(
      new HttpExceptionFilter(),
      new LibraryExceptionFilter(),
      new TypeOrmExceptionFilter(),
      new ValidationExceptionFilter(),
      new JwtExceptionFilter(),
    );
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (validationErrors: ValidationError[]) => {
          throw new ValidationException(validationErrors);
        },
      }),
    );
  }

  private setMiddlewares() {
    this.app.use(cookieParser(this.envData.getValue("cookie_secret")));
    this.app.use(helmet());
  }

  private setStaticAssets() {
    staticMediaConfigs.forEach((mediaConfig) => {
      if (mediaConfig.others) {
        this.app.useStaticAssets(
          path.join(__dirname, "..", "uploads", mediaConfig.mediaType, mediaConfig.model, mediaConfig.others),
          {
            prefix: `/media/${mediaConfig.model}/${mediaConfig.others}/${mediaConfig.mediaType}`,
          },
        );
      } else {
        this.app.useStaticAssets(path.join(__dirname, "..", "uploads", mediaConfig.mediaType, mediaConfig.model), {
          prefix: `/media/${mediaConfig.model}/${mediaConfig.mediaType}`,
        });
      }
    });
  }

  private setApiVersioning() {
    this.app.setGlobalPrefix("api");
    this.app.enableVersioning({ type: VersioningType.URI });
  }
}

async function init() {
  const nestApp = await NestFactory.create<NestExpressApplication>(AppModule);
  const server = new NestCoreConfig(nestApp);
  await server.run();
}

init().catch((err) => loggerFactory("NestApplication").error(err));
