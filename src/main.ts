import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { PromiseExcptionFilter } from "./common/filters/promise-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { ValidationExceptionFilter } from "./common/filters/validation-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const host = new ConfigService().get("APPLICATION_HOST");
  const port = new ConfigService().get("APPLICATION_PORT");
  const cookieSecret = new ConfigService().get("COOKIE_SECRET");

  /* 각각의 서비스에서 발생하는 custom exception을 제외한 서버에서 발생하는 에러
  혹은 404 에러 등을 글로벌적으로 처리할수 있음*/
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new PromiseExcptionFilter(),
    new ValidationExceptionFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 418,
    }),
  );

  app.use(cookieParser(cookieSecret));
  app.use(helmet());

  app.useStaticAssets(join(__dirname, "..", "uploads", "image"), {
    prefix: "/media",
  });
  app.useStaticAssets(join(__dirname, "..", "uploads", "video"), {
    prefix: "/media",
  });

  await app.listen(port, () => {
    new Logger("NestApplication").log(
      `Server is running at http://${host}:${port}`,
    );
  });
}

bootstrap();
