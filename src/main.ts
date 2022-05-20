import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as morgan from "morgan";
import * as dotenv from "dotenv";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 5147;

  // dotenv.config();
  // app.use(morgan("dev"));
  // app.use(helmet());

  await app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
bootstrap();
