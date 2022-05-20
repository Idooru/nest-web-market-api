import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthMiddlware } from "src/middlewares/auth.middleware";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddlware).forRoutes("auth");
  }
}
