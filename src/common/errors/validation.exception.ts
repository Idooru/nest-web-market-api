import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "class-validator";

export class ValidationException extends HttpException {
  constructor(validationError: ValidationError[]) {
    const errors = validationError.reduce(
      (acc, error) => ({
        ...acc,
        [error.property]: Object.values(error.constraints),
      }),
      {},
    );
    super({ errors, statusCode: 400 }, HttpStatus.BAD_REQUEST);
  }
}
