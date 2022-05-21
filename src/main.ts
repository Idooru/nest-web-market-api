import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./filter/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  /* 각각의 서비스에서 발생하는 custom exception을 제외한 서버에서 발생하는 에러
  혹은 404 에러 등을 글로벌적으로 처리할수 있음*/
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}!!!`);
  });
}
bootstrap();
