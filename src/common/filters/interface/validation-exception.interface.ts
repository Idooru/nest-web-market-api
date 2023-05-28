import { HttpStatus } from "aws-sdk/clients/lambda";

export interface ValidationExceptionType {
  statusCode: HttpStatus;
  errors: string[];
}
