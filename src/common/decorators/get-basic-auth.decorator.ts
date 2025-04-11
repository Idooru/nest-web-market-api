import { ArgumentsHost, BadRequestException, createParamDecorator } from "@nestjs/common";
import { BasicAuthDto } from "src/model/user/dto/request/basic-auth.dto";
import { loggerFactory } from "../functions/logger.factory";

const checkTokenLength = (token: string[]) => {
  if (token.length !== 2) {
    const message = "토큰 포맷이 잘못되었습니다.";
    loggerFactory("Invalid Basic Auth Token").error(message);
    throw new BadRequestException(message);
  }
};

export const GetBasicAuth = createParamDecorator((data, context: ArgumentsHost): BasicAuthDto => {
  const req = context.switchToHttp().getRequest<Request>();
  const rawToken = req.headers["authorization"] as string;

  if (!rawToken) {
    const message = "basic auth를 위한 값이 존재하지 않습니다.";
    loggerFactory("None Basic Auth").error(message);
    throw new BadRequestException(message);
  }

  const basicSplit = rawToken.split(" ");

  checkTokenLength(basicSplit);

  const [_, token] = basicSplit;
  const decoded = Buffer.from(token, "base64").toString("utf-8");
  const tokenSplit = decoded.split(":");

  checkTokenLength(tokenSplit);

  const [email, password] = tokenSplit;
  return { email, password };
});
