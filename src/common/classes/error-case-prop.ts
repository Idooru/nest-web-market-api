import { ErrorHandlerBuilder } from "../lib/error-handler/error-hanlder-builder";

export class ErrorCaseProp {
  constructor(
    protected readonly stuffs: string[],
    protected readonly stuffMeans: string[],
  ) {}

  protected stuffArr = [this.stuffMeans, this.stuffs].map((_, idx) => {
    return this.makeObjLiteral(this.stuffs[idx], this.stuffMeans[idx]);
  });

  public static clearStuffs() {
    ErrorHandlerBuilder.stuffs = [];
    ErrorHandlerBuilder.stuffMeans = [];
  }

  private makeObjLiteral(stuff: string, stuffMean: string) {
    return { [stuffMean]: stuff, key: () => stuffMean, value: () => stuff };
  }
}
