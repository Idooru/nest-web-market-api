import { InternalServerErrorException } from "@nestjs/common";
import { loggerFactory } from "../../functions/logger.factory";
import { LibraryException } from "../../errors/library.exception";

export class CatchCallbackFactoryLibrary {
  private throwLibraryException(errors: {
    err: Error;
    errorCase: string;
    libraryName: string;
    hasTransaction: boolean;
  }): never {
    const { err, errorCase, libraryName, hasTransaction } = errors;
    loggerFactory(errorCase).error(err);

    if (hasTransaction) {
      throw new InternalServerErrorException({
        errorCase,
        libraryName,
        message: err.message,
        type: "library",
      });
    }

    throw new LibraryException({
      response: {
        errorCase,
        libraryName,
        message: err.message,
      },
    });
  }

  public getCatchHashPasswordFunc(hasTransaction: boolean): (err: Error) => never {
    return (err: Error) => {
      const errorCase = "HashPassword";
      const libraryName = "bcrypt";

      this.throwLibraryException({
        err,
        errorCase,
        libraryName,
        hasTransaction,
      });
    };
  }

  public getCatchComparePasswordFunc(): (err: Error) => never {
    return (err: Error) => {
      const errorCase = "ComparePassword";
      const libraryName = "bcrypt";
      const hasTransaction = false;

      this.throwLibraryException({
        err,
        errorCase,
        libraryName,
        hasTransaction,
      });
    };
  }

  public getCatchJwtTokenSignFunc(): (err: Error) => never {
    return (err: Error) => {
      const errorCase = "JwtTokenSign";
      const libraryName = "JwtService";
      const hasTransaction = false;

      this.throwLibraryException({
        err,
        errorCase,
        libraryName,
        hasTransaction,
      });
    };
  }

  public getCatchJwtTokenVerifyFunc(): (err: Error) => never {
    return (err: Error) => {
      const errorCase = "JwtTokenVerify";
      const libraryName = "JwtService";
      const hasTransaction = false;

      this.throwLibraryException({
        err,
        errorCase,
        libraryName,
        hasTransaction,
      });
    };
  }

  public getCatchSendMailFunc(): (err: Error) => never {
    return (err: Error) => {
      const errorCase = "SendMail";
      const libraryName = "MailerService";
      const hasTransaction = false;

      this.throwLibraryException({
        err,
        errorCase,
        libraryName,
        hasTransaction,
      });
    };
  }
}
