import { JsonResponseInterceptor } from "./common/interceptors/json.response.interceptor";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionFilter } from "./common/exceptions/all-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

import cookieParser from "cookie-parser";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT;
  const cookieSecret = process.env.COOKIE_SECRET;

  /* 각각의 서비스에서 발생하는 custom exception을 제외한 서버에서 발생하는 에러
  혹은 404 에러 등을 글로벌적으로 처리할수 있음*/
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new JsonResponseInterceptor());
  app.use(cookieParser(cookieSecret));
  app.use(helmet());

  app.useStaticAssets(join(__dirname, "../uploads/image"), {
    prefix: "/media",
  });
  app.useStaticAssets(join(__dirname, "../uploads/video"), {
    prefix: "/media",
  });

  await app.listen(port, () => {
    console.log(`### Server is running at http://localhost:${port} ###`);
  });
}

bootstrap();
