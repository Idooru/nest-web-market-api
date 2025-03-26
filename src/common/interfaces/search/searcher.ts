import { BaseEntity } from "typeorm";

export interface Searcher<T> {
  findEntity(args: FindEntityArgs): Promise<T | T[]>;
}

export class FindEntityArgs {
  property: string;
  alias: unknown;
  getOne: boolean;
  joinEntities?: (typeof BaseEntity)[];
}
