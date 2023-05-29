import { HttpStatus } from "aws-sdk/clients/lambda";
import { HttpExceptionHandlingLibrary } from "./http-exception.handling.library";

export class HttpExceptionHandlingBuilder {
  private message: string;
  private occuredLocation: "class" | "function";
  private className?: string;
  private methodName?: string;
  private functionName?: string;
  private exceptionStatus: HttpStatus;

  public setMessage(message: string): this {
    this.message = message;
    return this;
  }

  public setOccuredLocation(occuredLocation: "class" | "function"): this {
    this.occuredLocation = occuredLocation;
    if (occuredLocation === "class") {
      this.functionName = undefined;
    } else if (occuredLocation === "function") {
      this.className = undefined;
      this.methodName = undefined;
    }
    return this;
  }

  public setOccuredClass(className: string, methodName: string): this {
    if (this.occuredLocation !== "class") {
      throw new Error(
        `occured location이 ${this.occuredLocation}이므로 setOccuredClass() 메서드를 호출 할 수 없습니다.`,
      );
    }
    this.className = className;
    this.methodName = methodName;
    return this;
  }

  public setOccuredFunction(functionName: string) {
    if (this.occuredLocation !== "function") {
      throw new Error(
        `occured location이 ${this.occuredLocation}이므로 setOccuredFunction() 메서드를 호출 할 수 없습니다.`,
      );
    }
    this.functionName = functionName;
    return this;
  }

  public setExceptionStatus(exceptionStatus: HttpStatus) {
    this.exceptionStatus = exceptionStatus;
    return this;
  }

  public handle() {
    new HttpExceptionHandlingLibrary(
      this.message,
      this.className,
      this.methodName,
      this.functionName,
      this.exceptionStatus,
    ).main();
  }
}
