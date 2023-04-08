import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ValidationExceptionFilter } from "./common/filters/validation-exception.filter";

import path from "path";
import helmet from "helmet";

class NestCoreConfig {
  private readonly scheme = new ConfigService().get("APPLICATION_SCHEME");
  private readonly host = new ConfigService().get("APPLICATION_HOST");
  private readonly port = new ConfigService().get("APPLICATION_PORT");
  private readonly cookieSecret = new ConfigService().get("COOKIE_SECRET");

  constructor(private readonly app: NestExpressApplication) {
    this.setGlobals();
    this.setMiddlewares();
    this.setStaticAssets();
  }

  private setGlobals() {
    this.app.useGlobalFilters(
      new HttpExceptionFilter(),
      new ValidationExceptionFilter(),
    );
    this.app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 418 }));
  }

  private setMiddlewares() {
    this.app.use(cookieParser(this.cookieSecret));
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

  public async run() {
    await this.app.listen(this.port, () =>
      new Logger("NestApplication").log(
        `Server is running at ${this.scheme}://${this.host}:${this.port}`,
      ),
    );
  }
}

async function init() {
  const nestApp = await NestFactory.create<NestExpressApplication>(AppModule);
  const server = new NestCoreConfig(nestApp);
  console.log("git test");
  server.run();
}

init().catch((err) => new Logger("NestApplication").error(err));
