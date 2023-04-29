import { Logger, ValidationError, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ValidationExceptionFilter } from "./common/filters/validation-exception.filter";
import { ValidationException } from "./common/errors/validation.exception";

import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";

class NestCoreConfig {
  private readonly envData = this.getDataFromEnv();

  constructor(private readonly app: NestExpressApplication) {
    this.setGlobals();
    this.setMiddlewares();
    this.setStaticAssets();
  }

  public async run() {
    await this.app.listen(this.envData.port, "0.0.0.0", () => {
      const nestLogger = new Logger("NestApplication");

      nestLogger.log(
        `Server is running at ${this.envData.scheme}://${this.envData.host}:${this.envData.port} | NODE_ENV: ${process.env.NODE_ENV}`,
      );
    });
  }

  private getDataFromEnv() {
    const scheme: string = new ConfigService().get("APPLICATION_SCHEME");
    const host: string = new ConfigService().get("APPLICATION_HOST");
    const port: string = new ConfigService().get("APPLICATION_PORT");
    const cookieSecret: string = new ConfigService().get("COOKIE_SECRET");

    return { scheme, host, port, cookieSecret };
  }

  private setGlobals() {
    this.app.useGlobalFilters(
      new HttpExceptionFilter(),
      new ValidationExceptionFilter(),
    );
    this.app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[]) => {
          throw new ValidationException(validationErrors);
        },
      }),
    );
  }

  private setMiddlewares() {
    this.app.use(cookieParser(this.envData.cookieSecret));
    this.app.use(helmet());
  }

  private setStaticAssets() {
    this.app.useStaticAssets(
      path.join(__dirname, "..", "uploads", "image", "product"),
      { prefix: "/media" },
    );

    this.app.useStaticAssets(
      path.join(__dirname, "..", "uploads", "image", "review"),
      { prefix: "/media" },
    );

    this.app.useStaticAssets(
      path.join(__dirname, "..", "uploads", "video", "review"),
      { prefix: "/media" },
    );

    this.app.useStaticAssets(
      path.join(__dirname, "..", "uploads", "image", "inquiry"),
      { prefix: "/media" },
    );

    this.app.useStaticAssets(
      path.join(__dirname, "..", "uploads", "video", "inquiry"),
      { prefix: "/media" },
    );

    this.app.useStaticAssets(
      path.join(__dirname, "..", "uploads", "image", "announcement"),
      { prefix: "/media" },
    );

    this.app.useStaticAssets(
      path.join(__dirname, "..", "uploads", "video", "announcement"),
      { prefix: "/media" },
    );
  }
}

async function init() {
  const nestApp = await NestFactory.create<NestExpressApplication>(AppModule);
  const server = new NestCoreConfig(nestApp);
  await server.run();
}

init().catch((err) => new Logger("NestApplication").error(err));
