// import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
// import { PromiseHandleException } from "./promise-handle.exception";
// import { Response } from "express";

// @Catch(PromiseHandleException)
// export class PromiseExcptionFilter implements ExceptionFilter {
//   catch(exception: PromiseHandleException, host: ArgumentsHost) {
//     const res = host.switchToHttp().getResponse<Response>();

//     return res.status(400).json({
//       success: false,
//       message: `${exception.msg}가 발생하였습니다.`,
//       timestamp: new Date().toString(),
//       reason: exception.errors.map((idx) => idx.reason.response),
//     });
//   }
// }
