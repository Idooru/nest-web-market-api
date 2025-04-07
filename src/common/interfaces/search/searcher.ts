import { BaseEntity } from "typeorm";

export interface Searcher<T, D, R> {
  findEntity(args: FindEntityArgs): Promise<T | T[]>;
  findAllRaws(dto: D | D[]): Promise<R[]>;
}

export class FindEntityArgs {
  property: string;
  alias: unknown;
  getOne: boolean;
  entities?: (typeof BaseEntity)[];
}
