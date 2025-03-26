import { BaseEntity } from "typeorm";

export interface SearchRepository<T> {
  findPureEntity(args: FindPureEntityArgs): Promise<T | T[]>;
  findOptionalEntity(args: FindOptionalEntityArgs): Promise<T | T[]>;
}

export class FindPureEntityArgs {
  property: string;
  alias: unknown;
  getOne: boolean;
}

export class FindOptionalEntityArgs {
  property: string;
  alias: unknown;
  joinEntities: (typeof BaseEntity)[];
  getOne: boolean;
}
