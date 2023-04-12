export class ErrorCaseProp {
  constructor(
    protected readonly stuffs: string[],
    protected readonly stuffMeans: string[],
  ) {}

  protected readonly stuffArr = [this.stuffMeans, this.stuffs].map((_, idx) => {
    return this.makeObjLiteral(this.stuffs[idx], this.stuffMeans[idx]);
  });

  private makeObjLiteral(stuff: string, stuffMean: string) {
    return { [stuffMean]: stuff, key: () => stuffMean, value: () => stuff };
  }
}
